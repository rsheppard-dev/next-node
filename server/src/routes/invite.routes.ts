import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createInviteSchema, getInviteSchema } from '../schemas/invite.schema';
import requireUser from '../middleware/requireUser';
import {
	createInvitesHandler,
	getInviteHandler,
	getInvitesHandler,
} from '../controllers/invite.controllers';

const router = Router();

router.post(
	'/',
	requireUser,
	validateResource(createInviteSchema),
	createInvitesHandler
);

router.get(
	'/:id',
	requireUser,
	validateResource(getInviteSchema),
	getInviteHandler
);

router.get('/', requireUser, getInvitesHandler);

export default router;
