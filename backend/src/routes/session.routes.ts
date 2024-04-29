import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createSessionSchema,
	refreshSessionSchema,
} from '../schemas/session.schemas';
import {
	createSessionHandler,
	deleteSessionHandler,
	getUserSessionsHandler,
	googleOAuthHandler,
	refreshSessionHandler,
} from '../controllers/session.controllers';
import requireUser from '../middleware/requireUser';
import loginLimiter from '../middleware/loginLimiter';

const router = Router();

router.post(
	'/',
	loginLimiter,
	validateResource(createSessionSchema),
	createSessionHandler
);
router.get('/', getUserSessionsHandler);
router.post(
	'/refresh',
	validateResource(refreshSessionSchema),
	refreshSessionHandler
);
router.delete('/', requireUser, deleteSessionHandler);
router.get('/oauth/google', googleOAuthHandler);

export default router;
