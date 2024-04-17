import { Router } from 'express';
import {
	createUserHandler,
	deleteUserHandler,
	forgotPasswordHandler,
	getCurrentUserHandler,
	getUserHandler,
	getUsersHandler,
	resetPasswordHandler,
	updateEmailHandler,
	updatePasswordHandler,
	updateProfileHandler,
	verifyResetPasswordHandler,
	verifyUserHandler,
} from '../controllers/user.controllers';
import validateResource from '../middleware/validateResource';
import {
	createUserSchema,
	deleteUserSchema,
	forgotPasswordSchema,
	getUserSchema,
	resetPasswordSchema,
	updateEmailSchema,
	updatePasswordSchema,
	updateProfileSchema,
	verifyResetPasswordSchema,
	verifyUserSchema,
} from '../schemas/user.schemas';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post('/', validateResource(createUserSchema), createUserHandler);

router.get('/', requireUser, getUsersHandler);

router.patch(
	'/profile',
	requireUser,
	validateResource(updateProfileSchema),
	updateProfileHandler
);

router.patch(
	'/password',
	requireUser,
	validateResource(updatePasswordSchema),
	updatePasswordHandler
);

router.patch(
	'/email',
	requireUser,
	validateResource(updateEmailSchema),
	updateEmailHandler
);

router.delete(
	'/',
	requireUser,
	validateResource(deleteUserSchema),
	deleteUserHandler
);

router.get('/me', requireUser, getCurrentUserHandler);

router.get(
	'/:id',
	requireUser,
	validateResource(getUserSchema),
	getUserHandler
);

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
	'/forgot-password/verify/:email/:ResetPasswordCode',
	validateResource(verifyResetPasswordSchema),
	verifyResetPasswordHandler
);

router.post(
	'/reset-password',
	validateResource(resetPasswordSchema),
	resetPasswordHandler
);

export default router;
