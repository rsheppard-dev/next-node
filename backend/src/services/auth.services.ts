import { db } from '../db';
import { session, User } from '../db/schema';
import { signJwt } from '../utils/jwt';
import { logger } from '../utils/logger';
import argon2 from 'argon2';

export async function createSession(userId: string) {
	const newSession = await db
		.insert(session)
		.values({
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		})
		.returning();

	return newSession[0];
}

export async function validatePassword(
	password: string,
	hashedPassword: string
) {
	try {
		return await argon2.verify(hashedPassword, password);
	} catch (error) {
		logger.error(error, 'Error validating password');
		return false;
	}
}

export function signAccessToken(user: User) {
	const accessToken = signJwt(user, 'access', {
		expiresIn: '15m',
	});
	return accessToken;
}

export async function signRefreshToken(userId: string) {
	const session = await createSession(userId);

	const refreshToken = signJwt(
		{
			sessionId: session.id,
		},
		'refresh',
		{
			expiresIn: '1y',
		}
	);

	return refreshToken;
}
