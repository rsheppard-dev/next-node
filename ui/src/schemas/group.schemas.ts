import { rolesEnum } from '@/types/group';
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

export const changeUserRoleInputSchema = z.object({
	userId: z.string().uuid(),
	groupId: z.string().uuid(),
	role: z.enum([rolesEnum.admin, rolesEnum.member]),
});

export const deleteGroupSchema = z.object({
	id: z.string().uuid(),
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupInputSchema>;
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleInputSchema>;
export type DeleteGroup = z.infer<typeof deleteGroupSchema>;
