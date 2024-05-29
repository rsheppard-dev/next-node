import { Session, User } from 'lucia';
import { env } from '../config/env';
import { logger } from './utils/logger';
import createServer from './utils/server';
import swaggerDocs from './utils/swagger';

const app = createServer();

const port = env.PORT;

app.listen(port, async () => {
	logger.info(`Server is running on http://localhost:${port}`);

	swaggerDocs(app, port);
});

declare global {
	namespace Express {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}
