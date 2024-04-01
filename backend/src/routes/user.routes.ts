import { FastifyInstance, FastifySchema } from 'fastify';
import {
	createUserHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
	verifyUserHandler,
} from '../controllers/user.controllers';
import {
	createUserJsonSchema,
	forgotPasswordJsonSchema,
	resetPasswordJsonSchema,
	verifyUserJsonSchema,
} from '../schemas/user.schemas';

export default async function userRoutes(app: FastifyInstance) {
	app.post('/', { schema: createUserJsonSchema }, createUserHandler);

	app.get(
		'/verify/:id/:verificationToken',
		{ schema: verifyUserJsonSchema },
		verifyUserHandler
	);

	app.post(
		'/forgot-password',
		{ schema: forgotPasswordJsonSchema },
		forgotPasswordHandler
	);

	app.post(
		'/reset-password/:id/:passwordResetToken',
		{ schema: resetPasswordJsonSchema },
		resetPasswordHandler
	);
}
