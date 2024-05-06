import { Request, Response } from 'express';
import { Group, PublicUser, User } from '../db/schema';
import {
	addUserToGroup,
	createGroup,
	deleteGroup,
	getGroupById,
	getGroupUsersByRole,
	getGroupWithUserRole,
	getUsersGroups,
	isUserGroupAdmin,
	isUserInGroup,
	removeUserFromGroup,
	updateGroup,
	updateGroupUserRole,
} from '../services/group.services';
import {
	CreateGroupBody,
	DeleteGroupBody,
	GetGroupParams,
	RemoveUserFromGroupParams,
	UpdateGroupBody,
	UpdateGroupRoleBody,
} from '../schemas/group.schemas';
import { getUserById } from '../services/user.services';

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
		const group = await getGroupWithUserRole(id, userId);

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

		const group = await getGroupWithUserRole(id, userId);

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

		const group = getGroupWithUserRole(id, userId);

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

export async function updateGroupRoleHandler(
	req: Request<{}, {}, UpdateGroupRoleBody>,
	res: Response<{}, { user: User }>
) {
	const { userId, groupId, role } = req.body;
	const loggedInUser = res.locals.user;

	try {
		const group = await getGroupById(groupId);

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		const user = await getUserById(userId);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found',
			});
		}

		const isAdmin = await isUserGroupAdmin(loggedInUser.id, group.id);

		if (!isAdmin) {
			return res.status(403).send({
				statusCode: 403,
				message: 'You are not an admin of this group',
			});
		}

		const isLastAdmin =
			(await getGroupUsersByRole(group.id, 'admin')).length === 1;

		if (isLastAdmin && user.id === loggedInUser.id && role !== 'admin') {
			return res.status(400).send({
				statusCode: 400,
				message: 'There must be at least one admin in the group',
			});
		}

		const updatedGroup = await updateGroupUserRole(userId, groupId, role);

		return res.send(updatedGroup);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong updating group role',
		});
	}
}

export async function removeUserFromGroupHandler(
	req: Request<RemoveUserFromGroupParams>,
	res: Response<{}, { user: User }>
) {
	const { groupId, userId } = req.params;
	const loggedInUser = res.locals.user;

	try {
		const groupPromise = getGroupById(groupId);
		const userPromise = getUserById(userId);
		const isInGroupPromise = isUserInGroup(userId, groupId);
		const isAdminPromise = isUserGroupAdmin(loggedInUser.id, groupId);
		const groupAdmins = getGroupUsersByRole(groupId, 'admin');

		const [group, user, isInGroup, isAdmin, admins] = await Promise.all([
			groupPromise,
			userPromise,
			isInGroupPromise,
			isAdminPromise,
			groupAdmins,
		]);

		if (!isAdmin) {
			return res.status(403).send({
				statusCode: 403,
				message: 'You are not an admin of this group',
			});
		}

		if (!group) {
			return res.status(404).send({
				statusCode: 404,
				message: 'Group not found',
			});
		}

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found',
			});
		}

		if (!isInGroup) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User is not in this group',
			});
		}

		if (admins.length === 1 && admins[0].id === userId) {
			return res.status(400).send({
				statusCode: 400,
				message: 'There must be at least one admin in the group',
			});
		}

		const result = await removeUserFromGroup(userId, groupId);

		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong removing user from group',
		});
	}
}
