import { eq } from 'drizzle-orm';
import { db } from '../db';
import { Session, sessions, User } from '../db/schema';
import { logger } from '../utils/logger';
import argon2 from 'argon2';
import { signJwt, verifyJwt } from '../utils/jwt';
import { getUserById, removePrivateUserProps } from './user.services';
import { env } from '../../config/env';

export const refreshCookieOptions = {
	maxAge: 3.154e10, // 1 year
	httpOnly: true,
	domain: env.NODE_ENV === 'production' ? 'secregifter.io' : 'localhost',
	secure: env.NODE_ENV === 'production',
};

export async function createSession(userId: string, userAgent?: string) {
	try {
		const newSession = await db
			.insert(sessions)
			.values({
				userId,
				userAgent,
			})
			.returning();

		return newSession[0];
	} catch (error) {
		logger.error(error, 'Error creating session');
		throw error;
	}
}

export async function getUserSessions(userId: string) {
	try {
		const results = await db.query.sessions.findMany({
			where: eq(sessions.userId, userId) && eq(sessions.isValid, true),
		});

		return results;
	} catch (error) {
		throw error;
	}
}

export async function getSessionById(sessionId: string) {
	try {
		const result = await db.query.sessions.findFirst({
			where: eq(sessions.id, sessionId),
		});

		return result;
	} catch (error) {
		logger.error(error, 'Error getting session by id');
		throw error;
	}
}

export async function updateSession(data: Session) {
	try {
		const result = await db
			.update(sessions)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(sessions.id, data.id))
			.returning();

		return result[0];
	} catch (error) {
		logger.error(error, 'Error updating session');
		throw error;
	}
}

export async function deleteSession(sessionId: string) {
	try {
		const result = await db
			.delete(sessions)
			.where(eq(sessions.id, sessionId))
			.returning();

		return result[0];
	} catch (error) {
		logger.error(error, 'Error deleting session');
		throw error;
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
			{ expiresIn: env.ACCESS_TOKEN_TTL }
		);

		return accessToken;
	} catch (error) {
		logger.error(error, 'Error refreshing access token');
		throw error;
	}
}
