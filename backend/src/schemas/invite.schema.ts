import { z } from 'zod';
import { rolesEnum } from '../db/schema';

export const createInviteSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Not a valid email'),
		groupId: z.string({ required_error: 'Group ID is required' }).uuid(),
		message: z.string().optional(),
		role: z.enum(rolesEnum.enumValues).optional(),
	}),
});

export type CreateInviteBody = z.infer<typeof createInviteSchema>['body'];
