import { Request, Response } from 'express';
import { CreateSessionBody } from '../schemas/session.schemas';
import {
	getUserByEmail,
	getUserById,
	removePrivateUserProps,
} from '../services/user.services';
import {
	createSession,
	getSessionById,
	getUserSessions,
	updateSession,
	validatePassword,
} from '../services/session.services';
import { JwtPayload, signJwt, verifyJwt } from '../utils/jwt';
import { env } from '../../config/env';
import { User } from '../db/schema';

export async function createSessionHandler(
	req: Request<{}, {}, CreateSessionBody>,
	res: Response
) {
	const { email, password } = req.body;
	const message = 'Invalid email or password';

	try {
		const user = await getUserByEmail(email);

		if (!user) return res.status(401).send(message);

		if (!user.isVerified) return res.status(403).send('Email is not verified');

		const isPasswordValid = await validatePassword(password, user.password);

		if (!isPasswordValid) return res.status(401).send(message);

		const session = await createSession(user.id, req.get('user-agent'));

		// sign an access token and a refresh token
		const accessToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'access',
			{
				expiresIn: '15m',
			}
		);

		const refreshToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'refresh',
			{ expiresIn: '1y' }
		);

		res.cookie('accessToken', accessToken, {
			maxAge: 15 * 60 * 1000, // 15 minutes
			httpOnly: true,
			domain: 'localhost',
			secure: env.NODE_ENV === 'production',
		});

		res.cookie('refreshToken', refreshToken, {
			maxAge: 3.154e10, // 1 year
			httpOnly: true,
			domain: 'localhost',
			secure: env.NODE_ENV === 'production',
		});

		return res.status(201).send({ accessToken, refreshToken });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to create session',
			error,
		});
	}
}

export async function getUserSessionsHandler(req: Request, res: Response) {
	const user = res.locals.user as User;

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

export async function deleteSessionHandler(req: Request, res: Response) {
	try {
		const sessionId = res.locals.user.sessionId as string;
		const session = await getSessionById(sessionId);

		if (!session) return res.status(404).send('Session not found');

		session.isValid = false;

		const result = await updateSession(session);

		if (!result) return res.status(404).send('Session not found');

		return res.send(result);
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to delete session',
			error,
		});
	}
}
