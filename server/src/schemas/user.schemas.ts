import { z } from 'zod';

export const createUserSchema = z.object({
	body: z
		.object({
			givenName: z
				.string({ required_error: 'First name is required' })
				.max(50, { message: 'First name must not exceed 50 characters' }),
			familyName: z
				.string({ required_error: 'Last name is required' })
				.max(50, { message: 'Last name must not exceed 50 characters' }),
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

export const getUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'User ID is required' }),
	}),
});

export const verifyUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'User ID is required' }),
		verificationCode: z
			.string({
				required_error: 'Verification code is required',
			})
			.length(6, 'Code must be 6 digits long')
			.regex(/^\d+$/, 'Code can only contain numbers'),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
	}),
});

export const verifyResetPasswordSchema = z.object({
	params: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
		ResetPasswordCode: z
			.string({
				required_error: 'Password reset code is required',
			})
			.length(6, 'Code must be 6 digits long')
			.regex(/^\d+$/, 'Code can only contain numbers'),
	}),
});

export const resetPasswordSchema = z.object({
	body: z
		.object({
			email: z
				.string({ required_error: 'Email is required' })
				.email('Not a valid email'),
			ResetPasswordCode: z
				.string({
					required_error: 'Password reset code is required',
				})
				.length(6, 'Code must be 6 digits long')
				.regex(/^\d+$/, 'Code can only contain numbers'),
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

export const updateProfileSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'User ID is required' }),
		givenName: z
			.string()
			.max(50, { message: 'First name must not exceed 50 characters' })
			.optional(),
		familyName: z
			.string()
			.max(50, { message: 'Last name must not exceed 50 characters' })
			.optional(),
		picture: z.string().optional(),
		dob: z.date().optional(),
	}),
});

export const updatePasswordSchema = z.object({
	body: z
		.object({
			id: z.string({ required_error: 'User ID is required' }),
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

export const updateEmailSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'User ID is required' }),
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
	}),
});

export const deleteUserSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'User ID is required' }),
	}),
});

export type CreateUserBody = z.infer<typeof createUserSchema>['body'];
export type GetUserParams = z.infer<typeof getUserSchema>['params'];
export type VerifyUserParams = z.infer<typeof verifyUserSchema>['params'];
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>['body'];
export type VerifyResetPasswordParams = z.infer<
	typeof verifyResetPasswordSchema
>['params'];
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body'];
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>['body'];
export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>['body'];
export type UpdateEmailBody = z.infer<typeof updateEmailSchema>['body'];
export type DeleteUserBody = z.infer<typeof deleteUserSchema>['body'];
