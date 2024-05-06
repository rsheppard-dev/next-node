import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createGroupHandler,
	deleteGroupHandler,
	getGroupHandler,
	getUsersGroupsHandler,
	removeUserFromGroupHandler,
	updateGroupHandler,
	updateGroupRoleHandler,
} from '../controllers/group.controllers';
import requireUser from '../middleware/requireUser';
import {
	createGroupSchema,
	deleteGroupSchema,
	getGroupSchema,
	removeUserFromGroupSchema,
	updateGroupRoleSchema,
	updateGroupSchema,
} from '../schemas/group.schemas';

const router = Router();

router.post(
	'/',
	requireUser,
	validateResource(createGroupSchema),
	createGroupHandler
);

router.get('/', requireUser, getUsersGroupsHandler);

router.get(
	'/:id',
	requireUser,
	validateResource(getGroupSchema),
	getGroupHandler
);

router.patch(
	'/',
	requireUser,
	validateResource(updateGroupSchema),
	updateGroupHandler
);

router.delete(
	'/',
	requireUser,
	validateResource(deleteGroupSchema),
	deleteGroupHandler
);

router.patch(
	'/role',
	requireUser,
	validateResource(updateGroupRoleSchema),
	updateGroupRoleHandler
);

router.delete(
	'/:groupId/:userId',
	requireUser,
	validateResource(removeUserFromGroupSchema),
	removeUserFromGroupHandler
);

export default router;
