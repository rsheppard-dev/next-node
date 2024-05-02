import { z } from 'zod';

export const createInvitesInputSchema = z.object({
	groupId: z.string().uuid(),
	emails: z.array(z.object({ email: z.string().email() })),
	message: z.string().optional(),
});

export type CreateInvitesInput = z.infer<typeof createInvitesInputSchema>;
