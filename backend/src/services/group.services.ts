import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { Group, groups, usersToGroups } from '../db/schema';
import { CreateGroupBody } from '../schemas/group.schemas';

export async function createGroup(data: CreateGroupBody, userId: string) {
	try {
		const newGroup = await db.insert(groups).values(data).returning();

		await db
			.insert(usersToGroups)
			.values({
				userId,
				groupId: newGroup[0].id,
				role: 'admin',
			})
			.execute();

		return newGroup[0];
	} catch (error) {
		throw error;
	}
}

export async function getGroupById(groupId: string) {
	try {
		const result = await db.query.groups.findFirst({
			where: group => eq(group.id, groupId),
		});

		return result;
	} catch (error) {
		throw error;
	}
}

export async function getUsersGroups(userId: string) {
	try {
		const results = await db.query.usersToGroups.findMany({
			where: usersToGroups => eq(usersToGroups.userId, userId),
			with: {
				groups: true,
			},
			columns: {},
		});

		return results.map(ug => ug.groups);
	} catch (error) {
		throw error;
	}
}

export async function updateGroup(group: Group) {
	try {
		const result = await db
			.update(groups)
			.set({
				...group,
				updatedAt: new Date(),
			})
			.where(eq(groups.id, group.id))
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export function deleteGroup(groupId: string) {
	try {
		const result = db.delete(groups).where(eq(groups.id, groupId)).returning();

		return result;
	} catch (error) {
		throw error;
	}
}

export async function addUserToGroup(
	userId: string,
	groupId: string,
	role: 'member' | 'admin' = 'member'
) {
	try {
		const result = await db
			.insert(usersToGroups)
			.values({
				userId,
				groupId,
				role,
			})
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export async function removeUserFromGroup(userId: string, groupId: string) {
	try {
		const result = await db
			.delete(usersToGroups)
			.where(
				and(
					eq(usersToGroups.userId, userId),
					eq(usersToGroups.groupId, groupId)
				)
			)
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export async function getGroupUsers(groupId: string) {
	try {
		const results = await db.query.usersToGroups.findMany({
			where: eq(usersToGroups.groupId, groupId),
			columns: {},
			with: {
				users: true,
			},
		});

		return results.map(ug => ug.users);
	} catch (error) {
		throw error;
	}
}

export async function getGroupUsersByRole(
	groupId: string,
	role: 'member' | 'admin'
) {
	try {
		const results = await db.query.usersToGroups.findMany({
			where: and(
				eq(usersToGroups.groupId, groupId),
				eq(usersToGroups.role, role)
			),
			columns: {},
			with: {
				users: true,
			},
		});

		return results.map(ug => ug.users);
	} catch (error) {
		throw error;
	}
}

export async function updateGroupUserRole(
	userId: string,
	groupId: string,
	role: 'member' | 'admin'
) {
	try {
		const result = await db
			.update(usersToGroups)
			.set({ role })
			.where(
				and(
					eq(usersToGroups.userId, userId),
					eq(usersToGroups.groupId, groupId)
				)
			)
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}
