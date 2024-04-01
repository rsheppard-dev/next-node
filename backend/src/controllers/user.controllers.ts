import { nanoid } from 'nanoid';
import {
	CreateUserBody,
	ForgotPasswordBody,
	ResetPasswordBody,
	ResetPasswordParams,
	VerifyUserParams,
} from '../schemas/user.schemas';
import {
	createUser,
	getUserByEmail,
	getUserById,
	updateUser,
} from '../services/user.services';
import { logger } from '../utils/logger';
import sendEmail from '../utils/mailer';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function createUserHandler(
	request: FastifyRequest<{ Body: CreateUserBody }>,
	reply: FastifyReply
) {
	const data = request.body;

	try {
		const user = await createUser(data);

		await sendEmail({
			from: 'Secret Gifter <noreply@secretgifter.io>',
			to: user.email,
			subject: 'Please verify your account',
			text: `Welcome to Secret Gifter! Please click the link to verify your account: Token: ${user.verificationToken} ID: ${user.id}`,
		});

		return reply.send(user);
	} catch (error: any) {
		if (error.code === '23505') {
			return reply.status(409).send({
				statusCode: 409,
				code: error.code,
				error: error.error,
				message: 'User with that email already exists',
			});
		}

		reply.send(error);
	}
}

export async function verifyUserHandler(
	request: FastifyRequest<{ Params: VerifyUserParams }>,
	reply: FastifyReply
) {
	const { id, verificationToken } = request.params;

	// find user by id
	const user = await getUserById(id);

	if (!user)
		return reply.status(404).send({
			statusCode: 404,
			message: 'Could not verify user',
		});

	// check if user verified
	if (user.isVerified)
		return reply.status(400).send({
			statusCode: 400,
			message: 'User already verified',
		});

	// check if verification token matches
	if (user.verificationToken !== verificationToken)
		return reply.status(400).send({
			statusCode: 400,
			message: 'Could not verify user',
		});

	// update user to be verified
	user.isVerified = true;
	const updatedUser = await updateUser(user);

	return reply.send(updatedUser);
}

export async function forgotPasswordHandler(
	request: FastifyRequest<{ Body: ForgotPasswordBody }>,
	reply: FastifyReply
) {
	const { email } = request.body;

	const message =
		'If a user is registered with that email you will receive instructions to reset your password.';

	const user = await getUserByEmail(email);

	if (!user) {
		logger.debug(`User with email ${email} not found`);
		return reply.send({ message });
	}

	if (!user.isVerified) {
		logger.debug(`User with email ${email} not verified`);
		return reply.status(403).send({
			status: 403,
			message: 'User is not verified',
		});
	}

	const passwordResetToken = nanoid();

	user.passwordResetToken = passwordResetToken;

	await updateUser(user);

	await sendEmail({
		from: 'Secret Gifter <noreply@secretgifter.io>',
		to: user.email,
		subject: 'Password Reset',
		text: `Click the link to reset your password: Token: ${passwordResetToken} ID: ${user.id}`,
	});

	logger.debug(`Password reset token sent to ${email}`);

	return reply.send({ message });
}

export async function resetPasswordHandler(
	request: FastifyRequest<{
		Body: ResetPasswordBody;
		Params: ResetPasswordParams;
	}>,
	reply: FastifyReply
) {
	const { id, passwordResetToken } = request.params;
	const { password } = request.body;

	const user = await getUserById(id);

	if (
		!user ||
		!user.passwordResetToken ||
		user.passwordResetToken !== passwordResetToken
	) {
		return reply.status(400).send({
			statusCode: 400,
			message: 'Could not reset password',
		});
	}

	user.passwordResetToken = null;
	user.password = password;

	const updatedUser = await updateUser(user);

	return reply.send(updatedUser);
}
