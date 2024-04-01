import { env } from '../config/env';
import { db } from './db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { buildServer } from './utils/server';

async function gracefulShutdown(app: Awaited<ReturnType<typeof buildServer>>) {
	await app.close();

	process.exit(0);
}

(async function main() {
	const app = await buildServer();

	await app.listen({
		host: env.HOST,
		port: env.PORT,
	});

	['SIGINT', 'SIGTERM'].forEach(signal => {
		process.on(signal, async () => {
			await gracefulShutdown(app);
		});
	});

	await migrate(db, {
		migrationsFolder: './src/db/migrations',
	});
})();
