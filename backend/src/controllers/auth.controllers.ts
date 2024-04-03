import { Request, Response } from 'express';
import { CreateSessionBody } from '../schemas/auth.schemas';
import { getUserByEmail, getUserById } from '../services/user.services';
import {
	getSessionById,
	signAccessToken,
	signRefreshToken,
	validatePassword,
} from '../services/auth.services';
import { verifyJwt } from '../utils/jwt';

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

		// sign an access token and a refresh token
		const accessToken = signAccessToken(user);
		const refreshToken = await signRefreshToken(user.id);

		return res.send({ accessToken, refreshToken });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to create session',
			error,
		});
	}
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
	// get the refresh token from the request headers
	const refreshToken = req.headers['x-refresh'] as string;
	const message = 'Could not refresh access token';

	try {
		const decoded = verifyJwt<{ sessionId: string }>(refreshToken, 'refresh');

		if (!decoded) return res.status(401).send(message);

		// get the session from the database
		const session = await getSessionById(decoded.sessionId);

		if (!session || !session.isValid) return res.status(401).send(message);

		// get the user from the database
		const user = await getUserById(session.userId);

		if (!user) return res.status(401).send(message);

		const accessToken = signAccessToken(user);

		return res.send({ accessToken });
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message,
			error,
		});
	}
}
