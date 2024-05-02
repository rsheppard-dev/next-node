import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { Invite, invites } from '../db/schema';
import { CreateInviteBody } from '../schemas/invite.schema';
import { getUserByEmail } from './user.services';
import { isUserInGroup } from './group.services';

export async function createInvites(data: CreateInviteBody, inviterId: string) {
	const invitesCreated = [];
	const inviteIssues = [];
	try {
		for (const email of data.emails.map(e => e.email)) {
			const user = await getUserByEmail(email);

			const inviteExists = await getGroupInviteByEmail(email, data.groupId);

			if (!!inviteExists && inviteExists.status !== 'rejected') {
				inviteIssues.push({
					email: email,
					issue: 'User already has an active invite to this group',
				});
				continue;
			}

			if (!!user) {
				const isUserAlreadyInGroup = await isUserInGroup(user.id, data.groupId);

				if (isUserAlreadyInGroup) {
					inviteIssues.push({
						email: email,
						issue: 'User is already in this group',
					});
					continue;
				}
			}

			const invite = await db
				.insert(invites)
				.values({
					...data,
					email,
					inviteeId: user?.id ?? null,
					inviterId,
				})
				.returning();

			invitesCreated.push(...invite);
		}

		return { invitesCreated, inviteIssues };
	} catch (error) {
		throw error;
	}
}

export async function getInviteById(id: string) {
	try {
		const invite = await db.query.invites.findFirst({
			where: invite => eq(invite.id, id),
			with: {
				group: {
					columns: {
						name: true,
					},
				},
			},
		});

		return invite;
	} catch (error) {
		throw error;
	}
}

export async function getGroupInviteByEmail(email: string, groupId: string) {
	try {
		const invite = await db.query.invites.findFirst({
			where: i => and(eq(i.email, email), eq(i.groupId, groupId)),
			with: {
				group: {
					columns: {
						name: true,
					},
				},
			},
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
			with: {
				group: {
					columns: {
						name: true,
					},
				},
			},
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
					with: {
						group: {
							columns: {
								name: true,
							},
						},
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
					with: {
						group: {
							columns: {
								name: true,
							},
						},
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
