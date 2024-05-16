import e, { Request, Response } from 'express';
import {
	CreateSessionBody,
	RefreshSessionParams,
} from '../schemas/session.schemas';
import {
	createUser,
	getUserByEmail,
	getUserById,
	removePrivateUserProps,
	updateUser,
} from '../services/user.services';
import {
	accessCookieOptions,
	createSession,
	deleteSession,
	getGoogleOAuthTokens,
	getSessionById,
	getUserSessions,
	GoogleUser,
	refreshAccessToken,
	refreshCookieOptions,
	updateSession,
	validatePassword,
} from '../services/session.services';
import { signJwt } from '../utils/jwt';
import { env } from '../../config/env';
import { PublicUser } from '../db/schema';
import jwt from 'jsonwebtoken';
import { unsealData } from 'iron-session';
import { SessionData, sessionOptions } from '../../config/session.config';

export async function createSessionHandler(
	req: Request<{}, {}, CreateSessionBody>,
	res: Response
) {
	const { email, password } = req.body;
	const message = 'Incorrect email or password. Please try again.';

	try {
		const user = await getUserByEmail(email);

		if (!user)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

		if (!user.isVerified)
			return res.status(403).send({
				statusCode: 403,
				message: 'Email has not been verified. Please check your email.',
			});

		const isPasswordValid = await validatePassword(password, user.password);

		if (!isPasswordValid)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

		let session = await createSession(user.id, req.get('user-agent'));

		// sign an access token and a refresh token
		const accessToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'access',
			{
				expiresIn: env.ACCESS_TOKEN_TTL,
			}
		);

		const refreshToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'refresh',
			{
				expiresIn: env.REFRESH_TOKEN_TTL,
			}
		);

		session.token = refreshToken;
		session.expiresIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);

		session = await updateSession(session);

		return res.status(201).send({
			...removePrivateUserProps(user),
			sessionId: session.id,
			accessToken,
			tokenExpiry: new Date(Date.now() + 1000 * 10),
		});
	} catch (error) {
		console.log('error', error);
		return res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong. Failed to create session.',
			error,
		});
	}
}

export async function refreshSessionHandler(
	req: Request<RefreshSessionParams>,
	res: Response
) {
	try {
		const { token } = req.params;

		if (!token)
			return res.status(401).send({
				statusCode: 401,
				message: 'No refresh token provided.',
			});

		const accessToken = await refreshAccessToken(token);

		if (!accessToken)
			return res.status(403).send({
				statusCode: 403,
				message: 'Failed to refresh access token.',
			});

		return res.send({ accessToken });
	} catch (error) {
		return res.status(403).send({
			statusCode: 403,
			message: 'Failed to refresh access token.',
			error,
		});
	}
}

export async function getSessionHandler(req: Request, res: Response) {
	try {
		const sessionCookie = req.cookies['sg.session'];

		const session = (await unsealData(
			sessionCookie,
			sessionOptions
		)) as SessionData;

		if (!session)
			return res.status(401).send({
				statusCode: 401,
				message: 'User not logged in.',
			});

		const dbSession = await getSessionById(session.id);

		if (!dbSession)
			return res.status(404).send({
				statusCode: 404,
				message: 'Session not found.',
			});

		const user = await getUserById(session.userId);

		if (!user)
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found.',
			});

		return res.send({
			...session,
			refreshToken: dbSession.token,
			expiresIn: dbSession.expiresIn,
		});
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to fetch user session.',
			error,
		});
	}
}

export async function getUserSessionsHandler(
	req: Request,
	res: Response<{}, { user: PublicUser }>
) {
	const user = res.locals.user;

	try {
		const sessions = await getUserSessions(user.id);

		return res.send(sessions);
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to fetch sessions.',
			error,
		});
	}
}

export async function deleteSessionHandler(req: Request, res: Response) {
	try {
		const sessionCookie = req.cookies['sg.session'];

		const { id } = (await unsealData(
			sessionCookie,
			sessionOptions
		)) as SessionData;

		console.log('id', id);

		const session = await getSessionById(id);

		console.log('session', session);

		if (!session)
			return res.status(404).send({
				statusCode: 404,
				message: 'Session not found.',
			});

		const result = await deleteSession(session.id);

		if (!result)
			return res.status(500).send({
				statusCode: 500,
				message: 'Failed to delete session.',
			});

		res.clearCookie('sg.session', {
			...sessionOptions.cookieOptions,
			maxAge: -1,
		});

		return res.send({ ...result });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to delete session.',
			error,
		});
	}
}

export async function googleOAuthHandler(req: Request, res: Response) {
	const code = req.query.code as string;
	try {
		const { id_token } = await getGoogleOAuthTokens(code);

		const googleUser = jwt.decode(id_token) as GoogleUser;

		if (!googleUser)
			return res.status(401).send({
				statusCode: 401,
				message: 'Failed to authenticate with Google.',
			});

		if (!googleUser.email_verified)
			return res.status(403).send({
				statusCode: 403,
				message: 'Google account has not been verified.',
			});

		let user = await getUserByEmail(googleUser.email);

		if (user) {
			user.givenName = googleUser.given_name;
			user.familyName = googleUser.family_name;
			user.picture = googleUser.picture;
			await updateUser(user);
		} else {
			user = await createUser({
				email: googleUser.email,
				givenName: googleUser.given_name,
				familyName: googleUser.family_name,
				picture: googleUser.picture,
				isVerified: true,
				password: '',
			});
		}

		const session = await createSession(user.id, req.get('user-agent'));

		// sign an access token and a refresh token
		const accessToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'access',
			{
				expiresIn: env.ACCESS_TOKEN_TTL,
			}
		);

		const refreshToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'refresh',
			{ expiresIn: env.REFRESH_TOKEN_TTL }
		);

		res.cookie('accessToken', accessToken, accessCookieOptions);
		res.cookie('refreshToken', refreshToken, refreshCookieOptions);

		res.redirect(env.ORIGIN);
	} catch (error) {
		return res.status(401).send({
			statusCode: 401,
			message: 'Failed to authenticate with Google.',
			error,
		});
	}
}
