import { env } from '../config/env';
import express from 'express';
import { logger } from './utils/logger';
import router from './routes';
import deserialiseUser from './middleware/deserialiseUser';

const app = express();

app.use(express.json());
app.use(deserialiseUser);
app.use(router);

const port = env.PORT;

app.listen(port, async () => {
	logger.info(`Server is running on http://localhost:${port}`);
});
