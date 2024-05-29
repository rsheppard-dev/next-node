import { customAlphabet } from 'nanoid';
import {
	CreateUserBody,
	DeleteUserBody,
	ForgotPasswordBody,
	GetUserParams,
	ResetPasswordBody,
	UpdateEmailBody,
	UpdatePasswordBody,
	UpdateProfileBody,
	VerifyResetPasswordParams,
	VerifyUserParams,
} from '../schemas/user.schemas';
import {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	getUsers,
	removePrivateUserProps,
	updateUser,
} from '../services/user.services';
import { logger } from '../utils/logger';
import sendEmail from '../utils/mailer';
import { Request, Response } from 'express';
import { env } from '../../config/env';
import { PublicUser, User } from '../db/schema';

const nanoid = customAlphabet('0123456789', 6);

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
				message: 'User with that email already exists.',
			});
		}

		res.status(500).send({
			statusCode: 500,
			message: 'Failed to create user.',
			error: error.message,
		});
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
				message: 'User not found.',
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

export async function getUsersHandler(req: Request, res: Response) {
	try {
		const users = await getUsers();

		return res.send(users.map(user => removePrivateUserProps(user)));
	} catch (error) {
		res.status(400).send({
			statusCode: 400,
			message: 'Failed to get users.',
		});
	}
}

export async function verifyUserHandler(
	req: Request<VerifyUserParams>,
	res: Response
) {
	const { id, verificationCode } = req.params;
	const message = 'Failed to verify user.';
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
				message: 'User is already verified.',
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

		return res.status(200).send(removePrivateUserProps(updatedUser));
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

		const message =
			'If a user is registered with that email you will receive instructions to reset your password.';

		const user = await getUserByEmail(email);

		if (!user) {
			logger.debug(`User with email ${email} not found.`);
			return res.send({
				message,
			});
		}

		if (!user.isVerified) {
			logger.debug(`User with email ${email} not verified.`);
			return res.status(403).send({
				status: 403,
				message: 'User is not verified.',
			});
		}

		const ResetPasswordCode = nanoid();
		const ResetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours

		user.ResetPasswordCode = ResetPasswordCode;
		user.ResetPasswordExpiresAt = ResetPasswordExpires;

		await updateUser(user);

		await sendEmail({
			from: 'Secret Gifter <noreply@secretgifter.io>',
			to: user.email,
			subject: 'Password Reset',
			text: `Click the link to reset your password: Token: ${ResetPasswordCode}`,
		});

		logger.debug(`Password reset token sent to ${email}`);

		return res.send({
			message,
		});
	} catch (error) {
		return res.status(400).send({
			statusCode: 500,
			message: 'Failed to generate password reset code.',
		});
	}
}

export async function verifyResetPasswordHandler(
	req: Request<VerifyResetPasswordParams>,
	res: Response
) {
	const { email, ResetPasswordCode } = req.params;
	const message = 'Failed to verify user.';

	try {
		const user = await getUserByEmail(email);

		if (
			!user ||
			!user.ResetPasswordCode ||
			user.ResetPasswordCode !== ResetPasswordCode
		) {
			return res.status(401).send({
				statusCode: 401,
				isValid: false,
				message,
			});
		}

		if (
			user.ResetPasswordExpiresAt &&
			user.ResetPasswordExpiresAt < new Date()
		) {
			return res.status(401).send({
				statusCode: 401,
				isValid: false,
				message: 'Password reset code has expired.',
			});
		}

		return res.send({
			isValid: true,
			message: 'Password reset code is valid.',
		});
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
	const { password, ResetPasswordCode, email } = req.body;
	const message = 'Failed to reset password.';

	try {
		const user = await getUserByEmail(email);

		if (
			!user ||
			!user.ResetPasswordCode ||
			user.ResetPasswordCode !== ResetPasswordCode
		) {
			return res.status(401).send({
				statusCode: 401,
				message,
			});
		}

		if (
			user.ResetPasswordExpiresAt &&
			user.ResetPasswordExpiresAt < new Date()
		) {
			return res.status(401).send({
				statusCode: 401,
				message: 'Password reset code has expired.',
			});
		}

		user.ResetPasswordCode = null;
		user.ResetPasswordExpiresAt = null;
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

export async function updateProfileHandler(
	req: Request<{}, {}, UpdateProfileBody>,
	res: Response<{}, { user: User }>
) {
	// const { id } = res.locals.user;
	const data = req.body;

	try {
		const user = await getUserById(data.id);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found.',
			});
		}

		const updatedUser = await updateUser(Object.assign(user, data));

		return res.send({
			statusCode: 200,
			message: 'User profile updated.',
			data: removePrivateUserProps(updatedUser),
		});
	} catch (error) {
		res.status(400).send({
			statusCode: 400,
			message: 'Failed to update user profile.',
		});
	}
}

export async function updatePasswordHandler(
	req: Request<{}, {}, UpdatePasswordBody>,
	res: Response<{}, { user: User }>
) {
	const { id, password } = req.body;

	try {
		const user = await getUserById(id);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found.',
			});
		}

		user.password = password;

		const updatedUser = await updateUser(user);

		return res.send({
			statusCode: 200,
			message: 'User password updated.',
			data: removePrivateUserProps(updatedUser),
		});
	} catch (error) {
		res.status(400).send({
			statusCode: 400,
			message: 'Failed to update user password.',
		});
	}
}

export async function updateEmailHandler(
	req: Request<{}, {}, UpdateEmailBody>,
	res: Response<{}, { user: User }>
) {
	const { id, email } = req.body;

	try {
		const user = await getUserById(id);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found.',
			});
		}

		if (user.email === email) {
			return res.status(409).send({
				statusCode: 409,
				message: 'New email cannot be the same as your current email.',
			});
		}

		user.email = email;
		user.isVerified = false;
		user.verificationCode = nanoid();

		const updatedUser = await updateUser(user);

		if (env.NODE_ENV !== 'test') {
			await sendEmail({
				from: 'Secret Gifter <noreply@secretgifter.io>',
				to: updatedUser.email,
				subject: 'Please verify your new email',
				text: `Welcome to Secret Gifter! Please click the link to verify your change of email: Token: ${user.verificationCode} ID: ${user.id}`,
			});
		}

		return res.send({
			statusCode: 200,
			message: 'User email updated.',
			data: removePrivateUserProps(updatedUser),
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Failed to update email.',
		});
	}
}

export async function deleteUserHandler(
	req: Request<{}, {}, DeleteUserBody>,
	res: Response<{}, { user: User }>
) {
	const { id } = req.body;

	try {
		const user = await getUserById(id);

		if (!user) {
			return res.status(404).send({
				statusCode: 404,
				message: 'User not found.',
			});
		}

		const deletedUser = await deleteUser(id);

		return res.send({
			statusCode: 200,
			message: 'User deleted.',
			data: removePrivateUserProps(deletedUser),
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: 'Failed to delete user.',
		});
	}
}
