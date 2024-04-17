import { z } from 'zod';

export const createGroupInputSchema = z.object({
	name: z.string().min(1, 'Group name is required'),
	description: z.string().optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
