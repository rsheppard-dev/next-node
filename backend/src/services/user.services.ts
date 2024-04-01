import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';
import { db } from '../db';
import { user } from '../db/schema';
import argon2 from 'argon2';

export async function createUser(data: InferInsertModel<typeof user>) {
	data.password = await hashPassword(data.password);

	const result = await db.insert(user).values(data).returning();

	return result[0];
}

export async function updateUser(data: InferSelectModel<typeof user>) {
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
	const result = await db.select().from(user);

	return result;
}

export async function getUserById(id: string) {
	const result = await db.select().from(user).where(eq(user.id, id));

	return result[0];
}

export async function getUserByEmail(email: string) {
	const result = await db.select().from(user).where(eq(user.email, email));

	return result[0];
}

export async function hashPassword(password: string) {
	return await argon2.hash(password);
}
