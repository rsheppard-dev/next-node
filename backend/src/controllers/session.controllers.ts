import { Request, Response } from 'express';
import { CreateSessionBody } from '../schemas/session.schemas';
import {
	getUserByEmail,
	removePrivateUserProps,
} from '../services/user.services';
import {
	createSession,
	getSessionById,
	getUserSessions,
	refreshAccessToken,
	refreshCookieOptions,
	updateSession,
	validatePassword,
} from '../services/session.services';
import { signJwt } from '../utils/jwt';
import { env } from '../../config/env';
import { PublicUser } from '../db/schema';

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

export async function refreshSessionHandler(req: Request, res: Response) {
	try {
		const refreshToken = req.cookies['refreshToken'];

		if (!refreshToken)
			return res.status(401).send({
				statusCode: 401,
				message: 'No refresh token provided',
			});

		const accessToken = await refreshAccessToken(refreshToken);

		if (!accessToken)
			return res.status(401).send({
				statusCode: 401,
				message: 'Failed to refresh access token',
			});

		return res.send({ accessToken });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
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
