import { eq } from 'drizzle-orm';
import { db } from '../db';
import { Invite, invites } from '../db/schema';
import { CreateInviteBody } from '../schemas/invite.schema';

export async function createInvite(data: CreateInviteBody, inviterId: string) {
	try {
		const invite = await db
			.insert(invites)
			.values({
				...data,
				inviterId,
			})
			.returning();

		return invite;
	} catch (error) {
		throw error;
	}
}

export async function getInviteById(id: string) {
	try {
		const invite = await db.query.invites.findFirst({
			where: invite => eq(invite.id, id),
		});

		return invite;
	} catch (error) {
		throw error;
	}
}

export async function getInvitesByEmail(email: string) {
	try {
		const invites = await db.query.invites.findMany({
			where: invite => eq(invite.email, email),
		});

		return invites;
	} catch (error) {
		throw error;
	}
}

export async function getInvitesSent(userId: string) {
	try {
		const results = await db.query.users.findMany({
			where: user => eq(user.id, userId),
			columns: {},
			with: {
				invitesSent: {
					columns: {
						inviteCode: false,
					},
				},
			},
		});

		return results[0].invitesSent;
	} catch (error) {
		throw error;
	}
}

export async function getInvitesReceived(userId: string) {
	try {
		const results = await db.query.users.findMany({
			where: user => eq(user.id, userId),
			columns: {},
			with: {
				invitesReceived: {
					columns: {
						inviteCode: false,
					},
				},
			},
		});

		return results[0].invitesReceived;
	} catch (error) {
		throw error;
	}
}

export async function updateInvite(data: Invite) {
	try {
		const result = await db
			.update(invites)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(invites.id, data.id))
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export async function deleteInvite(id: string) {
	try {
		const result = await db
			.delete(invites)
			.where(eq(invites.id, id))
			.returning();

		return result[0];
	} catch (error) {
		throw error;
	}
}

export function removePrivateInviteProps(data: Invite) {
	const { inviteCode, ...publicProps } = data;

	return publicProps;
}
