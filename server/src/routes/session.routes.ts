import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/session.schemas';
import {
	createSessionHandler,
	deleteSessionHandler,
	getSessionHandler,
} from '../controllers/session.controllers';
import loginLimiter from '../middleware/loginLimiter';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post(
	'/',
	loginLimiter,
	validateResource(createSessionSchema),
	createSessionHandler
);

router.delete('/', requireUser, deleteSessionHandler);

router.get('/', requireUser, getSessionHandler);

export default router;
