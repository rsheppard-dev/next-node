import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createGroupHandler,
	deleteGroupHandler,
	getGroupHandler,
	getUsersGroupsHandler,
	updateGroupHandler,
} from '../controllers/group.controllers';
import requireUser from '../middleware/requireUser';
import {
	createGroupSchema,
	deleteGroupSchema,
	getGroupSchema,
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

export default router;
