import express from 'express';
import deserialiseUser from '../middleware/deserialiseUser';
import router from '../routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export default function createServer() {
	const app = express();

	app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
	app.use(express.json());
	app.use(cookieParser());
	app.use(deserialiseUser);
	app.use(router);

	return app;
}
