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
	params: z.object({
		token: z.string({ required_error: 'Refresh token is required' }),
	}),
});

export const getSessionSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'Session ID is required' }),
	}),
});

export type CreateSessionBody = z.infer<typeof createSessionSchema>['body'];
export type GetSessionParams = z.infer<typeof getSessionSchema>['params'];
export type RefreshSessionParams = z.infer<
	typeof refreshSessionSchema
>['params'];
