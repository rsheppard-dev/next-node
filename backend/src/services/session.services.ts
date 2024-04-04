import { eq } from 'drizzle-orm';
import { db } from '../db';
import { Session, session, User } from '../db/schema';
import { logger } from '../utils/logger';
import argon2 from 'argon2';
import { signJwt, verifyJwt } from '../utils/jwt';
import { getUserById, removePrivateUserProps } from './user.services';

export async function createSession(userId: string, userAgent?: string) {
	const newSession = await db
		.insert(session)
		.values({
			userId,
			userAgent,
		})
		.returning();

	return newSession[0];
}

export async function getUserSessions(userId: string) {
	const sessions = await db.query.session.findMany({
		where: eq(session.userId, userId) && eq(session.isValid, true),
	});

	return sessions;
}

export async function getSessionById(sessionId: string) {
	const result = await db.query.session.findFirst({
		where: eq(session.id, sessionId),
	});

	return result;
}

export async function updateSession(data: Session) {
	try {
		const result = await db
			.update(session)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(session.id, data.id))
			.returning();

		return result[0];
	} catch (error) {
		return error as Error;
	}
}

export async function deleteSession(sessionId: string) {
	try {
		const result = await db
			.delete(session)
			.where(eq(session.id, sessionId))
			.returning();

		return result[0];
	} catch (error) {
		return error as Error;
	}
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

export async function refreshAccessToken(refreshToken: string) {
	try {
		const { data } = verifyJwt<User & { sessionId: string }>(
			refreshToken,
			'refresh'
		);

		if (!data) throw new Error('Could not refresh access token');

		const session = await getSessionById(data.sessionId);

		if (!session || !session.isValid) throw new Error('Session not valid');

		const user = await getUserById(session.userId);

		if (!user) throw new Error('User not found');

		const accessToken = signJwt(
			{
				...removePrivateUserProps(user),
				sessionId: session.id,
			},
			'access',
			{ expiresIn: '15m' }
		);

		return accessToken;
	} catch (error) {
		logger.error(error, 'Error refreshing access token');
	}
}
