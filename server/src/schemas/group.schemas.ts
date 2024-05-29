import { z } from 'zod';
import { rolesEnum } from '../db/schema';

export const createGroupSchema = z.object({
	body: z.object({
		name: z.string({ required_error: 'Name is required' }),
		description: z.string().optional(),
	}),
});

export const deleteGroupSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'ID is required' }),
	}),
});

export const getGroupSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'ID is required' }),
	}),
});

export const updateGroupSchema = z.object({
	body: z.object({
		id: z.string({ required_error: 'ID is required' }),
		name: z.string({ required_error: 'Name is required' }),
		description: z.string().optional(),
	}),
});

export const updateGroupRoleSchema = z.object({
	body: z.object({
		userId: z.string({ required_error: 'User ID is required' }),
		groupId: z.string({ required_error: 'Group ID is required' }),
		role: z.enum(rolesEnum.enumValues),
	}),
});

export const removeUserFromGroupSchema = z.object({
	params: z.object({
		groupId: z.string({ required_error: 'Group ID is required' }),
		userId: z.string({ required_error: 'User ID is required' }),
	}),
});

export type CreateGroupBody = z.infer<typeof createGroupSchema>['body'];
export type DeleteGroupParams = z.infer<typeof deleteGroupSchema>['params'];
export type GetGroupParams = z.infer<typeof getGroupSchema>['params'];
export type UpdateGroupBody = z.infer<typeof updateGroupSchema>['body'];
export type UpdateGroupRoleBody = z.infer<typeof updateGroupRoleSchema>['body'];
export type RemoveUserFromGroupParams = z.infer<
	typeof removeUserFromGroupSchema
>['params'];
