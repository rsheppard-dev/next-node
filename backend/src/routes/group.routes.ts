import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createGroupHandler,
	deleteGroupHandler,
	getUsersGroupsHandler,
} from '../controllers/group.controllers';
import requireUser from '../middleware/requireUser';
import { createGroupSchema, deleteGroupSchema } from '../schemas/group.schemas';

const router = Router();

router.post(
	'/',
	requireUser,
	validateResource(createGroupSchema),
	createGroupHandler
);

router.get('/', requireUser, getUsersGroupsHandler);

router.delete(
	'/',
	requireUser,
	validateResource(deleteGroupSchema),
	deleteGroupHandler
);

export default router;
