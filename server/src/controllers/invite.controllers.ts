import { Request, Response } from 'express';
import { User } from '../db/schema';
import { CreateInviteBody, GetInviteParams } from '../schemas/invite.schema';
import {
	createInvites,
	getInviteById,
	getInvitesReceived,
	getInvitesSent,
	removePrivateInviteProps,
	updateInvite,
} from '../services/invite.services';
import { getGroupById, isUserGroupAdmin } from '../services/group.services';
import { env } from '../../config/env';
import sendEmail from '../utils/mailer';

export async function createInvitesHandler(
	req: Request<{}, {}, CreateInviteBody>,
	res: Response<{}, { user: User }>
) {
	const user = res.locals.user;
	const { groupId } = req.body;
	try {
		const group = await getGroupById(groupId);

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		const isAdmin = await isUserGroupAdmin(user.id, groupId);

		if (!isAdmin) {
			return res.status(403).send({
				statusCode: 403,
				message: 'You do not have permission to invite users to this group',
			});
		}

		const { invitesCreated, inviteIssues } = await createInvites(
			req.body,
			user.id
		);

		for (const invite of invitesCreated) {
			if (env.NODE_ENV !== 'test') {
				await sendEmail({
					from: 'Secret Gifter <noreply@secretgifter.io>',
					to: invite.email,
					subject: "You've been invited to join a group!",
					text: `You've been invited to join the Secret Gifter group, ${
						group.name
					} by ${user.givenName} ${user.familyName}.\n\n${
						invite?.message ? invite.message + '\n\n' : null
					}Click the link to accept this invite: http://localhost:3000/invites/${
						invite.id
					}?code=${
						invite.inviteCode
					}&accept=true\n\nOr click the link to decline this invite: http://localhost:3000/invites/${
						invite.id
					}?code=${invite.inviteCode}&accept=false.`,
				});
			}
		}

		return res.status(201).send({
			invites: invitesCreated.map(invite => removePrivateInviteProps(invite)),
			issues: inviteIssues,
		});
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong creating invites',
		});
	}
}

export async function getInvitesHandler(
	req: Request,
	res: Response<{}, { user: User }>
) {
	const user = res.locals.user;

	try {
		const invitesReceivedPromise = getInvitesReceived(user.id);
		const invitesSentPromise = getInvitesSent(user.id);

		const [invitesReceived, invitesSent] = await Promise.all([
			invitesReceivedPromise,
			invitesSentPromise,
		]);

		return res.status(200).send({
			invitesReceived,
			invitesSent,
		});
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong getting invites',
		});
	}
}

export async function getInviteHandler(
	req: Request<GetInviteParams>,
	res: Response<{}, { user: User }>
) {
	const { id } = req.params;
	const { id: userId } = res.locals.user;

	try {
		const invite = await getInviteById(id);

		if (!invite) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Invite not found',
			});
		}

		if (invite.inviterId !== userId && invite.inviteeId !== userId) {
			return res.status(403).send({
				statusCode: 403,
				message: 'You do not have permission to view this invite',
			});
		}

		if (invite.inviteeId === userId && invite.status === 'sent') {
			invite.status = 'viewed';
			await updateInvite(invite);
		}

		res.send(invite);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong getting invite',
		});
	}
}
