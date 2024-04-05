import express from 'express';
import deserialiseUser from '../middleware/deserialiseUser';
import router from '../routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from '../../config/env';

export default function createServer() {
	const app = express();

	app.use(cookieParser());
	app.use(cors({ origin: env.ORIGIN, credentials: true }));
	app.use(express.json());
	app.use(deserialiseUser);
	app.use(router);

	return app;
}
