import type { Config } from 'drizzle-kit';
import { env } from './config/env';

export default {
	schema: './src/db/schema.ts',
	out: './src/db/migrations',
	breakpoints: false,
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	migrations: {
		table: 'migrations',
		schema: 'src/db',
	},
	verbose: true,
	strict: true,
} satisfies Config;
