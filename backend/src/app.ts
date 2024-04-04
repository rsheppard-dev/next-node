import { env } from '../config/env';
import { logger } from './utils/logger';
import createServer from './utils/server';

const app = createServer();

const port = env.PORT;

app.listen(port, async () => {
	logger.info(`Server is running on http://localhost:${port}`);
});
