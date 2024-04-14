import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/session.schemas';
import {
	createSessionHandler,
	deleteSessionHandler,
	getUserSessionsHandler,
	googleOAuthHandler,
	refreshSessionHandler,
} from '../controllers/session.controllers';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post('/', validateResource(createSessionSchema), createSessionHandler);
router.get('/', getUserSessionsHandler);
router.get('/refresh', refreshSessionHandler);
router.delete('/', requireUser, deleteSessionHandler);
router.get('/oauth/google', googleOAuthHandler);

export default router;
