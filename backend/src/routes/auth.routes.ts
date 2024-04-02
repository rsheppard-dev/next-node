import { Router } from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schemas/auth.schemas';
import { createSessionHandler } from '../controllers/auth.controllers';

const router = Router();

router.post(
	'/login',
	validateResource(createSessionSchema),
	createSessionHandler
);

export default router;
