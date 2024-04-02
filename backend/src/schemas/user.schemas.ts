import { z } from 'zod';

export const createUserSchema = z.object({
	body: z
		.object({
			givenName: z
				.string({ required_error: 'First name is required' })
				.min(1)
				.max(255),
			familyName: z
				.string({ required_error: 'Last name is required' })
				.min(1)
				.max(255),
			email: z
				.string({ required_error: 'Email is required' })
				.email('Not a valid email'),
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
		}),
});

export const verifyUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'User ID is required' }),
		verificationToken: z.string({
			required_error: 'Verification token is required',
		}),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
	}),
});

export const resetPasswordSchema = z.object({
	body: z
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
		}),
	params: z.object({
		id: z.string({ required_error: 'User ID is required' }),
		passwordResetToken: z.string({
			required_error: 'Password reset token is required',
		}),
	}),
});

export type CreateUserBody = z.infer<typeof createUserSchema>['body'];
export type VerifyUserParams = z.infer<typeof verifyUserSchema>['params'];
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body'];
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>['params'];
