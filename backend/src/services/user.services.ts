import { eq } from 'drizzle-orm';
import { db } from '../db';
import { NewUser, User, user } from '../db/schema';
import argon2 from 'argon2';
import { logger } from '../utils/logger';

export async function createUser(data: NewUser) {
	data.password = await hashPassword(data.password);

	const result = await db.insert(user).values(data).returning();

	return result[0];
}

export async function updateUser(data: User) {
	if (data.password && !data.password.startsWith('$argon2')) {
		data.password = await hashPassword(data.password);
	}

	const result = await db
		.update(user)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(user.id, data.id))
		.returning();

	return result[0];
}

export async function getUsers() {
	const result = await db.query.user.findMany();

	return result;
}

export async function getUserById(id: string) {
	const result = await db.query.user.findFirst({
		where: eq(user.id, id),
	});

	return result;
}

export async function getUserByEmail(email: string) {
	try {
		const result = await db.query.user.findFirst({
			where: eq(user.email, email),
		});

		return result;
	} catch (error) {
		logger.error(error, 'Error getting user by email');
	}
}

export async function hashPassword(password: string) {
	return await argon2.hash(password);
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
