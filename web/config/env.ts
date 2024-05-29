import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_SERVER_ENDPOINT: z.string(),
		NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: z.string(),
		NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI: z.string(),

		NEXT_PUBLIC_KINDE_CREDENTIALS_CONNECTION_ID: z.string(),
		NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID: z.string(),
		NEXT_PUBLIC_KINDE_APPLE_CONNECTION_ID: z.string(),
	},
	server: {
		NEXTAUTH_SECRET: z.string(),
		NEXT_RUNTIME: z.union([z.literal('nodejs'), z.literal('edge')]),
		NODE_ENV: z
			.union([
				z.literal('development'),
				z.literal('production'),
				z.literal('test'),
			])
			.default('development'),
		SESSION_SECRET: z.string(),
		KINDE_CLIENT_ID: z.string(),
		KINDE_CLIENT_SECRET: z.string(),
		KINDE_ISSUER_URL: z.string(),
		KINDE_SITE_URL: z.string(),
		KINDE_POST_LOGOUT_REDIRECT_URL: z.string(),
		KINDE_POST_LOGIN_REDIRECT_URL: z.string(),
	},

	runtimeEnv: {
		NEXT_PUBLIC_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
		NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:
			process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
		NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI:
			process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,

		NEXT_PUBLIC_KINDE_CREDENTIALS_CONNECTION_ID:
			process.env.NEXT_PUBLIC_KINDE_CREDENTIALS_CONNECTION_ID,
		NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID:
			process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID,
		NEXT_PUBLIC_KINDE_APPLE_CONNECTION_ID:
			process.env.NEXT_PUBLIC_KINDE_APPLE_CONNECTION_ID,

		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_RUNTIME: process.env.NEXT_RUNTIME,
		SESSION_SECRET: process.env.SESSION_SECRET,

		KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID,
		KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET,
		KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
		KINDE_SITE_URL: process.env.KINDE_SITE_URL,
		KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
		KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
	},
	emptyStringAsUndefined: true,
});
