import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createGroupHandler,
	getUsersGroupsHandler,
} from '../controllers/group.controllers';
import requireUser from '../middleware/requireUser';
import { createGroupSchema } from '../schemas/group.schemas';

const router = Router();

router.post(
	'/',
	requireUser,
	validateResource(createGroupSchema),
	createGroupHandler
);

router.get('/', requireUser, getUsersGroupsHandler);

export default router;
