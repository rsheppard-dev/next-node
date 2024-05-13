import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { PublicUser } from '../db/schema';
import { logger } from '../utils/logger';

export default async function deserialiseUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = (req.headers.Authorization ||
			req.headers.authorization) as string | undefined;

		const accessToken = authHeader?.split('Bearer ')[1];

		if (!accessToken) return next();

		const { data, isExpired } = verifyJwt<PublicUser>(accessToken, 'access');

		if (data && !isExpired) res.locals.user = data;

		return next();
	} catch (error) {
		logger.error(error, 'Error deserialising user');
		throw error;
	}
}
