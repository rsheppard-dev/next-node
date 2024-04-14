import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_SERVER_ENDPOINT: z.string(),
		NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: z.string(),
		NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI: z.string(),
	},

	runtimeEnv: {
		NEXT_PUBLIC_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
		NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:
			process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
		NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI:
			process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,
	},
	emptyStringAsUndefined: true,
});
