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

router.post('/', validateResource(createSessionSchema), createSessionHandler);
router.get('/', getUserSessionsHandler);

router.delete('/', requireUser, deleteSessionHandler);

export default router;
