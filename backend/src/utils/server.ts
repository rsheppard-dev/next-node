import Fastify from 'fastify';
import { logger } from './logger';
import userRoutes from '../routes/user.routes';
import authRoutes from '../routes/auth.routes';
import groupRoutes from '../routes/group.routes';

export async function buildServer() {
	const app = Fastify({ logger });

	// register plugins

	// register routes
	app.register(authRoutes, { prefix: '/api/auth' });
	app.register(userRoutes, { prefix: '/api/users' });
	app.register(groupRoutes, { prefix: '/api/groups' });

	return app;
}
