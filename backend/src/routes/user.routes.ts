import { Router } from 'express';
import {
	createUserHandler,
	forgotPasswordHandler,
	getCurrentUserHandler,
	resetPasswordHandler,
	verifyUserHandler,
} from '../controllers/user.controllers';
import validateResource from '../middleware/validateResource';
import {
	createUserSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyUserSchema,
} from '../schemas/user.schemas';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post('/', validateResource(createUserSchema), createUserHandler);

router.get(
	'/verify/:id/:verificationToken',
	validateResource(verifyUserSchema),
	verifyUserHandler
);

router.post(
	'/forgot-password',
	validateResource(forgotPasswordSchema),
	forgotPasswordHandler
);

router.post(
	'/reset-password/:id/:passwordResetToken',
	validateResource(resetPasswordSchema),
	resetPasswordHandler
);

router.get('/me', requireUser, getCurrentUserHandler);

export default router;
