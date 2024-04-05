import { z } from 'zod';

export const loginInputSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
