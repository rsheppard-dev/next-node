import { z } from 'zod';
import { rolesEnum } from '../db/schema';

export const createInviteSchema = z.object({
	body: z.object({
		emails: z.array(
			z.object({
				email: z.string({ required_error: 'Email is required' }).email(),
			})
		),
		groupId: z.string({ required_error: 'Group ID is required' }).uuid(),
		message: z.string().optional(),
		role: z.enum(rolesEnum.enumValues).optional(),
	}),
});

export const getInviteSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'Invite ID is required' }).uuid(),
	}),
});

export type CreateInviteBody = z.infer<typeof createInviteSchema>['body'];
export type GetInviteParams = z.infer<typeof getInviteSchema>['params'];
