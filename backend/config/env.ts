import zennv from 'zennv';
import { z } from 'zod';

const schema = z.object({
	NODE_ENV: z
		.union([
			z.literal('development'),
			z.literal('production'),
			z.literal('test'),
		])
		.default('development'),
	ORIGIN: z.string().default('http://localhost:3000'),
	PORT: z.number().default(4000),
	PGHOST: z.string(),
	PGDATABASE: z.string(),
	PGUSER: z.string(),
	PGPASSWORD: z.string(),
	ENDPOINT_ID: z.string(),
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
