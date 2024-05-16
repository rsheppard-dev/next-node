import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createSessionSchema,
	refreshSessionSchema,
} from '../schemas/session.schemas';
import {
	createSessionHandler,
	deleteSessionHandler,
	getSessionHandler,
	getUserSessionsHandler,
	googleOAuthHandler,
	refreshSessionHandler,
} from '../controllers/session.controllers';
import loginLimiter from '../middleware/loginLimiter';

const router = Router();

router.post(
	'/',
	loginLimiter,
	validateResource(createSessionSchema),
	createSessionHandler
);
router.get('/', getSessionHandler);
router.get('/all', getUserSessionsHandler);
router.get(
	'/refresh/:token',
	validateResource(refreshSessionSchema),
	refreshSessionHandler
);
router.delete('/', deleteSessionHandler);
router.get('/oauth/google', googleOAuthHandler);

export default router;
