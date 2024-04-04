import { nanoid } from 'nanoid';
import {
	CreateUserBody,
	ForgotPasswordBody,
	GetUserParams,
	ResetPasswordBody,
	ResetPasswordParams,
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

export async function createUserHandler(
	req: Request<{}, {}, CreateUserBody>,
	res: Response
) {
	const data = req.body;

	try {
		const user = await createUser(data);

		await sendEmail({
			from: 'Secret Gifter <nores@secretgifter.io>',
			to: user.email,
			subject: 'Please verify your account',
			text: `Welcome to Secret Gifter! Please click the link to verify your account: Token: ${user.verificationToken} ID: ${user.id}`,
		});

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
	const { id, verificationToken } = req.params;

	// find user by id
	const user = await getUserById(id);

	if (!user)
		return res.status(404).send({
			statusCode: 404,
			message: 'Could not verify user',
		});

	// check if user verified
	if (user.isVerified)
		return res.status(400).send({
			statusCode: 400,
			message: 'User already verified',
		});

	// check if verification token matches
	if (user.verificationToken !== verificationToken)
		return res.status(400).send({
			statusCode: 400,
			message: 'Could not verify user',
		});

	// update user to be verified
	user.isVerified = true;
	user.verificationToken = null;
	const updatedUser = await updateUser(user);

	return res.send(removePrivateUserProps(updatedUser));
}

export async function forgotPasswordHandler(
	req: Request<{}, {}, ForgotPasswordBody>,
	res: Response
) {
	const { email } = req.body;

	const message =
		'If a user is registered with that email you will receive instructions to reset your password.';

	const user = await getUserByEmail(email);

	if (!user) {
		logger.debug(`User with email ${email} not found`);
		return res.send({ message });
	}

	if (!user.isVerified) {
		logger.debug(`User with email ${email} not verified`);
		return res.status(403).send({
			status: 403,
			message: 'User is not verified',
		});
	}

	const passwordResetToken = nanoid();
	const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 18); // 18 hours

	user.passwordResetToken = passwordResetToken;
	user.passwordResetExpiresAt = passwordResetExpires;

	await updateUser(user);

	await sendEmail({
		from: 'Secret Gifter <nores@secretgifter.io>',
		to: user.email,
		subject: 'Password Reset',
		text: `Click the link to reset your password: Token: ${passwordResetToken} ID: ${user.id}`,
	});

	logger.debug(`Password reset token sent to ${email}`);

	return res.send({ message });
}

export async function resetPasswordHandler(
	req: Request<ResetPasswordParams, {}, ResetPasswordBody>,
	res: Response
) {
	const { id, passwordResetToken } = req.params;
	const { password } = req.body;

	const user = await getUserById(id);

	if (
		!user ||
		!user.passwordResetToken ||
		user.passwordResetToken !== passwordResetToken
	) {
		return res.status(400).send({
			statusCode: 400,
			message: 'Could not reset password',
		});
	}

	user.passwordResetToken = null;
	user.password = password;

	const updatedUser = await updateUser(user);

	return res.send(removePrivateUserProps(updatedUser));
}

export async function getCurrentUserHandler(req: Request, res: Response) {
	return res.send(res.locals.user);
}
