import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import {
	createSessionSchema,
	deleteSessionSchema,
	getSessionSchema,
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
import requireUser from '../middleware/requireUser';
import loginLimiter from '../middleware/loginLimiter';

const router = Router();

router.post(
	'/',
	loginLimiter,
	validateResource(createSessionSchema),
	createSessionHandler
);
router.get('/:id', validateResource(getSessionSchema), getSessionHandler);
router.get('/', getUserSessionsHandler);
router.get(
	'/refresh/:token',
	validateResource(refreshSessionSchema),
	refreshSessionHandler
);
router.delete(
	'/:id',
	validateResource(deleteSessionSchema),
	deleteSessionHandler
);
router.get('/oauth/google', googleOAuthHandler);

export default router;
