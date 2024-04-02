import type { Config } from 'drizzle-kit';
import { env } from './config/env';

export default {
	schema: './src/db/schema.ts',
	out: './src/db/migrations',
	breakpoints: false,
	driver: 'pg',
	dbCredentials: {
		connectionString: env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
} satisfies Config;
