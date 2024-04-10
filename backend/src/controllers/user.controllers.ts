import { customAlphabet } from 'nanoid';
import {
	CreateUserBody,
	ForgotPasswordBody,
	GetUserParams,
	ResetPasswordBody,
	VerifyResetPasswordParams,
	VerifyUserParams,
} from '../schemas/user.schemas';
import {
	createUser,
	getUserByEmail,
	getUserById,
	removePrivateUserProps,
	updateUser,
} from '../services/user.services';
import { logger } from '../utils/logger';
import sendEmail from '../utils/mailer';
import { Request, Response } from 'express';
import { env } from '../../config/env';
import { PublicUser } from '../db/schema';

export async function createUserHandler(
	req: Request<{}, {}, CreateUserBody>,
	res: Response
) {
	const data = req.body;

	try {
		const user = await createUser(data);

		if (env.NODE_ENV !== 'test') {
			await sendEmail({
				from: 'Secret Gifter <noreply@secretgifter.io>',
				to: user.email,
				subject: 'Please verify your account',
				text: `Welcome to Secret Gifter! Please click the link to verify your account: Token: ${user.verificationCode} ID: ${user.id}`,
			});
		}

		return res.status(201).send(removePrivateUserProps(user));
	} catch (error: any) {
		if (error.code === '23505') {
			return res.status(409).send({
				statusCode: 409,
				code: error.code,
				error: error.error,
				message: 'User with that email already exists',
			});
		}

		res.send(error);
	}
}

export async function getUserHandler(
	req: Request<GetUserParams>,
	res: Response
) {
	const { id } = req.params;

	try {
		const user = await getUserById(id);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found',
			});
		}

		return res.send(removePrivateUserProps(user));
	} catch (error: any) {
		return res.status(400).send({
			statusCode: 400,
			message: error.message,
			error,
		});
	}
}

export async function verifyUserHandler(
	req: Request<VerifyUserParams>,
	res: Response
) {
	const { id, verificationCode } = req.params;
	const message = 'Failed to verify user';
	try {
		// find user by id
		const user = await getUserById(id);

		if (!user)
			return res.status(404).send({
				statusCode: 404,
				message,
			});

		// check if user verified
		if (user.isVerified)
			return res.status(400).send({
				statusCode: 400,
				message: 'User already verified',
			});

		// check if verification token matches
		if (user.verificationCode !== verificationCode)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

		// update user to be verified
		user.isVerified = true;
		user.verificationCode = null;
		const updatedUser = await updateUser(user);

		return res.send(removePrivateUserProps(updatedUser));
	} catch (error) {
		res.status(401).send({
			statusCode: 401,
			message,
		});
	}
}

export async function forgotPasswordHandler(
	req: Request<{}, {}, ForgotPasswordBody>,
	res: Response
) {
	try {
		const { email } = req.body;

		const nanoid = customAlphabet('0123456789', 6);

		const message =
			'If a user is registered with that email you will receive instructions to reset your password.';

		const user = await getUserByEmail(email);

		if (!user) {
			logger.debug(`User with email ${email} not found`);
			return res.send({
				message,
			});
		}

		if (!user.isVerified) {
			logger.debug(`User with email ${email} not verified`);
			return res.status(403).send({
				status: 403,
				message: 'User is not verified',
			});
		}

		const passwordResetCode = nanoid();
		const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours

		user.passwordResetCode = passwordResetCode;
		user.passwordResetExpiresAt = passwordResetExpires;

		await updateUser(user);

		await sendEmail({
			from: 'Secret Gifter <noreply@secretgifter.io>',
			to: user.email,
			subject: 'Password Reset',
			text: `Click the link to reset your password: Token: ${passwordResetCode}`,
		});

		logger.debug(`Password reset token sent to ${email}`);

		return res.send({
			message,
		});
	} catch (error) {
		return res.status(400).send({
			statusCode: 500,
			message: 'Failed to generate password reset code',
		});
	}
}

export async function verifyResetPasswordHandler(
	req: Request<VerifyResetPasswordParams>,
	res: Response
) {
	const { email, passwordResetCode } = req.params;
	const message = 'Failed to verify user';

	try {
		const user = await getUserByEmail(email);

		if (
			!user ||
			!user.passwordResetCode ||
			user.passwordResetCode !== passwordResetCode
		) {
			return res.status(401).send({
				statusCode: 401,
				isValid: false,
				message,
			});
		}

		if (
			user.passwordResetExpiresAt &&
			user.passwordResetExpiresAt < new Date()
		) {
			return res.status(401).send({
				statusCode: 401,
				isValid: false,
				message: 'Password reset code has expired',
			});
		}

		return res.send({ isValid: true, message: 'Password reset code is valid' });
	} catch (error) {
		res.status(401).send({
			statusCode: 401,
			isValid: false,
			message,
		});
	}
}

export async function resetPasswordHandler(
	req: Request<{}, {}, ResetPasswordBody>,
	res: Response
) {
	const { password, passwordResetCode, email } = req.body;
	const message = 'Failed to reset password';

	try {
		const user = await getUserByEmail(email);

		if (
			!user ||
			!user.passwordResetCode ||
			user.passwordResetCode !== passwordResetCode
		) {
			return res.status(401).send({
				statusCode: 401,
				message,
			});
		}

		if (
			user.passwordResetExpiresAt &&
			user.passwordResetExpiresAt < new Date()
		) {
			return res.status(401).send({
				statusCode: 401,
				message: 'Password reset code has expired',
			});
		}

		user.passwordResetCode = null;
		user.passwordResetExpiresAt = null;
		user.password = password;

		const updatedUser = await updateUser(user);

		return res.send(removePrivateUserProps(updatedUser));
	} catch (error) {
		res.status(400).send({
			statusCode: 400,
			message,
		});
	}
}

export async function getCurrentUserHandler(
	req: Request,
	res: Response<{}, { user: PublicUser }>
) {
	return res.send(res.locals.user);
}
