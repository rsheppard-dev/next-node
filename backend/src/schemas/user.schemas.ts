import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const createUserBodySchema = z
	.object({
		givenName: z
			.string({ required_error: 'First name is required' })
			.min(1)
			.max(255),
		familyName: z
			.string({ required_error: 'Last name is required' })
			.min(1)
			.max(255),
		email: z.string({ required_error: 'Email is required' }).email(),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string({
			required_error: 'Confirm password is required',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const verifyUserParamsSchema = z.object({
	id: z.string({ required_error: 'User ID is required' }),
	verificationToken: z.string({
		required_error: 'Verification token is required',
	}),
});

export const forgotPasswordBodySchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email(),
});

export const resetPasswordParamsSchema = z.object({
	id: z.string({ required_error: 'User ID is required' }),
	passwordResetToken: z.string({
		required_error: 'Password reset token is required',
	}),
});

export const resetPasswordBodySchema = z
	.object({
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string({
			required_error: 'Confirm password is required',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type VerifyUserParams = z.infer<typeof verifyUserParamsSchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordParamsSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

export const createUserJsonSchema = {
	body: zodToJsonSchema(createUserBodySchema, 'createUserBodySchema'),
};
export const verifyUserJsonSchema = {
	params: zodToJsonSchema(verifyUserParamsSchema, 'verifyUserParamsSchema'),
};
export const forgotPasswordJsonSchema = {
	body: zodToJsonSchema(forgotPasswordBodySchema, 'forgotPasswordSchema'),
};
export const resetPasswordJsonSchema = {
	body: zodToJsonSchema(resetPasswordBodySchema, 'resetPasswordBodySchema'),
	params: zodToJsonSchema(
		resetPasswordParamsSchema,
		'resetPasswordParamsSchema'
	),
};
