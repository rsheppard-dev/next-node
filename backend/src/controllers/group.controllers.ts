import { Request, Response } from 'express';
import { Group, PublicUser, User } from '../db/schema';
import {
	createGroup,
	deleteGroup,
	getGroupById,
	getUsersGroups,
	isUserGroupAdmin,
	updateGroup,
} from '../services/group.services';
import {
	CreateGroupBody,
	DeleteGroupBody,
	GetGroupParams,
	UpdateGroupBody,
} from '../schemas/group.schemas';

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

export async function getGroupHandler(
	req: Request<GetGroupParams>,
	res: Response<{}, { user: User }>
) {
	const { id } = req.params;
	const { id: userId } = res.locals.user;

	try {
		const group = await getGroupById(id, userId);

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		res.send(group);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong getting group',
		});
	}
}

export async function updateGroupHandler(
	req: Request<{}, {}, UpdateGroupBody>,
	res: Response<{}, { user: User }>
) {
	try {
		const { id } = req.body;
		const { id: userId } = res.locals.user;

		const group = await getGroupById(id, userId);

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		if (group.role !== 'admin') {
			return res.status(403).send({
				statusCode: 403,
				message: 'You are not an admin of this group',
			});
		}

		group.name = req.body.name;
		group.description = req.body?.description ?? null;

		const updatedGroup = await updateGroup(group);

		res.status(200).send(updatedGroup);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong updating group',
		});
	}
}

export async function deleteGroupHandler(
	req: Request<{}, {}, DeleteGroupBody>,
	res: Response<{}, { user: User }>
) {
	try {
		const { id } = req.body;
		const { id: userId } = res.locals.user;

		const group = getGroupById(id, userId);

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
