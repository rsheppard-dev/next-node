import { Request, Response } from 'express';
import { PublicUser } from '../db/schema';
import { createGroup, getUsersGroups } from '../services/group.services';
import { CreateGroupBody } from '../schemas/group.schemas';

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
