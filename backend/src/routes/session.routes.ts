import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/session.schemas';
import {
	createSessionHandler,
	deleteSessionHandler,
	getUserSessionsHandler,
} from '../controllers/session.controllers';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post(
	'/login',
	validateResource(createSessionSchema),
	createSessionHandler
);
router.get('/', getUserSessionsHandler);

router.delete('/logout', requireUser, deleteSessionHandler);

export default router;
