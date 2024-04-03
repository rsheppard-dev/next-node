import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/auth.schemas';
import {
	createSessionHandler,
	refreshAccessTokenHandler,
} from '../controllers/auth.controllers';

const router = Router();

router.post(
	'/login',
	validateResource(createSessionSchema),
	createSessionHandler
);

router.post('/refresh', refreshAccessTokenHandler);

export default router;
