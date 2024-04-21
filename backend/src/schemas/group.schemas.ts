import { z } from 'zod';

export const createGroupSchema = z.object({
	body: z.object({
		name: z.string({ required_error: 'Name is required' }),
		description: z.string().optional(),
	}),
});

export const deleteGroupSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'ID is required' }).uuid(),
	}),
});

export const getGroupSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'ID is required' }).uuid(),
	}),
});

export const updateGroupSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'ID is required' }).uuid(),
		name: z.string({ required_error: 'Name is required' }),
		description: z.string().optional(),
	}),
});

export type CreateGroupBody = z.infer<typeof createGroupSchema>['body'];
export type DeleteGroupBody = z.infer<typeof deleteGroupSchema>['body'];
export type GetGroupParams = z.infer<typeof getGroupSchema>['params'];
export type UpdateGroupBody = z.infer<typeof updateGroupSchema>['body'];
