import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { PublicUser } from '../db/schema';
import {
	accessCookieOptions,
	refreshAccessToken,
} from '../services/session.services';
import { logger } from '../utils/logger';

export default async function deserialiseUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = (req.headers.Authorization ||
			req.headers.authorization) as string | undefined;

		const accessToken =
			authHeader?.split('Bearer ')[1] ?? req.cookies['accessToken'];

		const refreshToken = req.cookies['refreshToken'] as string | undefined;

		if (!accessToken) return next();

		const { data, isExpired } = verifyJwt<PublicUser>(accessToken, 'access');

		if (data && !isExpired) {
			res.locals.user = data;
			return next();
		}

		if (refreshToken && isExpired) {
			logger.info('Access token expired, trying to refresh...');
			const newAccessToken = await refreshAccessToken(refreshToken);

			if (newAccessToken) {
				res.setHeader('Authorization', `Bearer ${newAccessToken}`);
				res.cookie('accessToken', newAccessToken, accessCookieOptions);

				const { data: newData } = verifyJwt<PublicUser>(
					newAccessToken,
					'access'
				);

				logger.info('Access token refreshed');

				res.locals.user = newData;
			}
		}

		return next();
	} catch (error) {
		logger.error(error, 'Error deserialising user');
		throw error;
	}
}
