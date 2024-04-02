import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../../config/env';
import { logger } from '../utils/logger';

(async function main() {
	const pool = new Pool({
		connectionString: env.DATABASE_URL,
	});

	const db: NodePgDatabase = drizzle(pool);

	logger.info('Migrating database...');

	await migrate(db, {
		migrationsFolder: 'src/db/migrations',
	});

	logger.info('Database migrated successfully');

	await pool.end();
})();
