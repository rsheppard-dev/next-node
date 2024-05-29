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

	SESSION_SECRET: z.string(),

	ACCESS_TOKEN_TTL: z.string().default('15m'),
	REFRESH_TOKEN_TTL: z.string().default('1y'),

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

	GOOGLE_OAUTH_CLIENT_ID: z.string(),
	GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
	GOOGLE_OAUTH_REDIRECT_URI: z.string(),
});

export const env = zennv({
	dotenv: true,
	schema,
});
