import { z } from 'zod';

export const createSessionSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Invalid email or password'),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, 'Invalid email or password'),
	}),
});

export const refreshSessionSchema = z.object({
	body: z.object({
		refreshToken: z.string({ required_error: 'Refresh token is required' }),
	}),
});

export type CreateSessionBody = z.infer<typeof createSessionSchema>['body'];
export type RefreshSessionBody = z.infer<typeof refreshSessionSchema>['body'];
