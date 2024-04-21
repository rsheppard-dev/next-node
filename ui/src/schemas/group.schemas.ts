import { z } from 'zod';

export const createGroupInputSchema = z.object({
	name: z.string().min(1, 'Group name is required'),
	description: z.string().optional(),
});

export const updateGroupInputSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'Group name is required'),
	description: z.string().optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupInputSchema>;
