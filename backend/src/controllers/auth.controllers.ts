import { Request, Response } from 'express';
import { CreateSessionBody } from '../schemas/auth.schemas';
import { getUserByEmail } from '../services/user.services';
import {
	signAccessToken,
	signRefreshToken,
	validatePassword,
} from '../services/auth.services';
import { logger } from '../utils/logger';

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
