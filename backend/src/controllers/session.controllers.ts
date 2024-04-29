import { Request, Response } from 'express';
import {
	CreateSessionBody,
	RefreshSessionBody,
} from '../schemas/session.schemas';
import {
	createUser,
	getUserByEmail,
	removePrivateUserProps,
	updateUser,
} from '../services/user.services';
import {
	accessCookieOptions,
	createSession,
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

export async function createSessionHandler(
	req: Request<{}, {}, CreateSessionBody>,
	res: Response
) {
	const { email, password } = req.body;
	const message = 'Incorrect email or password';

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
				message: 'Email has not been verified',
			});

		const isPasswordValid = await validatePassword(password, user.password);

		if (!isPasswordValid)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

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

		return res.status(201).send({ accessToken });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to create session',
			error,
		});
	}
}

export async function refreshSessionHandler(
	req: Request<{}, {}, RefreshSessionBody>,
	res: Response
) {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken)
			return res.status(401).send({
				statusCode: 401,
				message: 'No refresh token provided',
			});

		const accessToken = await refreshAccessToken(refreshToken);

		if (!accessToken)
			return res.status(403).send({
				statusCode: 403,
				message: 'Failed to refresh access token',
			});

		return res.send({ accessToken });
	} catch (error) {
		return res.status(403).send({
			statusCode: 403,
			message: 'Failed to refresh access token',
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
			message: 'Failed to fetch sessions',
			error,
		});
	}
}

export async function deleteSessionHandler(
	req: Request,
	res: Response<{}, { user: PublicUser }>
) {
	try {
		const sessionId = res.locals.user.sessionId;
		const session = await getSessionById(sessionId);

		if (!session) return res.status(404).send('Session not found');

		session.isValid = false;

		const result = await updateSession(session);

		if (!result) return res.status(404).send('Session not found');

		const cookies = req.cookies;

		if (!cookies) return res.sendStatus(204);

		res.clearCookie('accessToken', { ...accessCookieOptions, maxAge: -1 });
		res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: -1 });

		return res.send({ ...result, message: 'Session invalidated' });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to delete session',
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
				message: 'Failed to authenticate with Google',
			});

		if (!googleUser.email_verified)
			return res.status(403).send({
				statusCode: 403,
				message: 'Google account has not been verified',
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
			message: 'Failed to authenticate with Google',
			error,
		});
	}
}
