import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '../../config/env';
import * as schema from './schema';

const pool = new Pool({
	host: env.PGHOST,
	database: env.PGDATABASE,
	user: env.PGUSER,
	password: env.PGPASSWORD,
	port: 5432,
	ssl: true,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
