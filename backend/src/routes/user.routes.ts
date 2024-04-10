import { Router } from 'express';
import {
	createUserHandler,
	forgotPasswordHandler,
	getCurrentUserHandler,
	getUserHandler,
	resetPasswordHandler,
	verifyResetPasswordHandler,
	verifyUserHandler,
} from '../controllers/user.controllers';
import validateResource from '../middleware/validateResource';
import {
	createUserSchema,
	forgotPasswordSchema,
	getUserSchema,
	resetPasswordSchema,
	verifyResetPasswordSchema,
	verifyUserSchema,
} from '../schemas/user.schemas';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post('/', validateResource(createUserSchema), createUserHandler);

router.get('/me', requireUser, getCurrentUserHandler);

router.get('/:id', validateResource(getUserSchema), getUserHandler);

router.get(
	'/verify/:id/:verificationCode',
	validateResource(verifyUserSchema),
	verifyUserHandler
);

router.post(
	'/forgot-password',
	validateResource(forgotPasswordSchema),
	forgotPasswordHandler
);

router.get(
	'/forgot-password/verify/:email/:passwordResetCode',
	validateResource(verifyResetPasswordSchema),
	verifyResetPasswordHandler
);

router.post(
	'/reset-password',
	validateResource(resetPasswordSchema),
	resetPasswordHandler
);

export default router;
