import zennv from 'zennv';
import { z } from 'zod';

const schema = z.object({
	NODE_ENV: z
		.union([z.literal('development'), z.literal('production')])
		.default('development'),
	PORT: z.number().default(3000),
	HOST: z.string().default('0.0.0.0'),
	DATABASE_URL: z.string(),
	ACCESS_TOKEN_PRIVATE_KEY: z.string(),
	ACCESS_TOKEN_PUBLIC_KEY: z.string(),
	REFRESH_TOKEN_PRIVATE_KEY: z.string(),
	REFRESH_TOKEN_PUBLIC_KEY: z.string(),
	MAIL_HOST: z.string(),
	MAIL_PORT: z.number(),
	MAIL_USER: z.string(),
	MAIL_PASSWORD: z.string(),
});

export const env = zennv({
	dotenv: true,
	schema,
});
