import { z } from 'zod';

export const createGroupSchema = z.object({
	body: z.object({
		name: z.string({ required_error: 'Name is required' }),
		description: z.string().optional(),
	}),
});

export type CreateGroupBody = z.infer<typeof createGroupSchema>['body'];
