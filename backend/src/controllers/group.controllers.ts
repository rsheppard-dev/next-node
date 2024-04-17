import { Request, Response } from 'express';
import { PublicUser, User } from '../db/schema';
import {
	createGroup,
	deleteGroup,
	getGroupById,
	getUsersGroups,
	isUserGroupAdmin,
} from '../services/group.services';
import { CreateGroupBody, DeleteGroupBody } from '../schemas/group.schemas';

export async function createGroupHandler(
	req: Request<{}, {}, CreateGroupBody>,
	res: Response<{}, { user: PublicUser }>
) {
	try {
		const { user } = res.locals;
		const data = req.body;

		const group = await createGroup(data, user.id);

		res.status(201).send(group);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong creating group',
		});
	}
}
export async function getUsersGroupsHandler(
	req: Request,
	res: Response<{}, { user: PublicUser }>
) {
	const { user } = res.locals;

	try {
		const groups = await getUsersGroups(user.id);

		res.status(200).send(groups);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong getting groups by user',
		});
	}
}

export async function deleteGroupHandler(
	req: Request<{}, {}, DeleteGroupBody>,
	res: Response<{}, { user: User }>
) {
	try {
		const { id } = req.body;
		res.locals.user;

		const group = getGroupById(id);

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		const isAdmin = await isUserGroupAdmin(res.locals.user.id, id);

		if (!isAdmin) {
			return res.status(403).send({
				statusCode: 403,
				message: 'You are not an admin of this group',
			});
		}

		await deleteGroup(id);

		res.status(204).send();
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong deleting group',
		});
	}
}
