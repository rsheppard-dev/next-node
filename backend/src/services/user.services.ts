import { eq } from 'drizzle-orm';
import { db } from '../db';
import { NewUser, User, users } from '../db/schema';
import argon2 from 'argon2';
import { logger } from '../utils/logger';
import { CreateUserBody } from '../schemas/user.schemas';
import { GoogleUser } from './session.services';

export async function createUser(data: NewUser) {
	data.password = await hashPassword(data.password);

	const result = await db.insert(users).values(data).returning();

	return result[0];
}

export async function updateUser(data: User) {
	try {
		if (data.password && !data.password.startsWith('$argon2')) {
			data.password = await hashPassword(data.password);
		}

		const result = await db
			.update(users)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(users.id, data.id))
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export async function getUsers() {
	try {
		const result = await db.query.users.findMany();

		return result;
	} catch (error) {
		throw error;
	}
}

export async function getUserById(id: string) {
	try {
		const result = await db.query.users.findFirst({
			where: eq(users.id, id),
		});

		return result;
	} catch (error) {
		throw error;
	}
}

export async function getUserByEmail(email: string) {
	try {
		const result = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		return result;
	} catch (error) {
		logger.error(error, 'Error getting user by email');
		throw error;
	}
}

export async function deleteUser(id: string) {
	try {
		const result = await db.delete(users).where(eq(users.id, id)).returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export async function hashPassword(password: string) {
	return await argon2.hash(password);
}

export async function upsertUser(data: CreateUserBody, googleData: GoogleUser) {
	try {
		const user = db
			.insert(users)
			.values({
				...data,
			})
			.onConflictDoUpdate({
				target: users.email,
				set: {
					givenName: googleData.given_name,
					familyName: googleData.family_name,
					picture: googleData.picture,
					updatedAt: new Date(),
				},
			})
			.returning();

		return user;
	} catch (error) {
		throw error;
	}
}

export function removePrivateUserProps(user: User) {
	const {
		password,
		verificationCode,
		passwordResetCode,
		passwordResetExpiresAt,
		...publicProps
	} = user;

	return publicProps;
}
