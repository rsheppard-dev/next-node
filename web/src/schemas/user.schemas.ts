import { z } from 'zod';

export const createUserInputSchema = z
	.object({
		givenName: z
			.string()
			.min(1, { message: 'First name is required' })
			.max(50, { message: 'First name must not exceed 50 characters' }),
		familyName: z
			.string()
			.min(1, { message: 'Last name is required' })
			.max(50, { message: 'Last name must not exceed 50 characters' }),
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Confirm password is required'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const forgotPasswordInputSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export const verifyUserInputSchema = z.object({
	id: z.string(),
	code: z
		.string()
		.length(6, 'Code must be 6 digits long')
		.regex(/^\d+$/, 'Code can only contain numbers'),
});

export const verifyResetPasswordCodeInputSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	code: z
		.string()
		.length(6, 'Code must be 6 digits long')
		.regex(/^\d+$/, 'Code can only contain numbers'),
});

export const resetPasswordInputSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		ResetPasswordCode: z
			.string()
			.length(6, 'Code must be 6 digits long')
			.regex(/^\d+$/, 'Code can only contain numbers'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Confirm password is required'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type VerifyUserInput = z.infer<typeof verifyUserInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
export type VerifyResetPasswordCodeInput = z.infer<
	typeof verifyResetPasswordCodeInputSchema
>;
