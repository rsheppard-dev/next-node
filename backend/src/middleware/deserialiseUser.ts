import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { PublicUser } from '../db/schema';
import { refreshAccessToken } from '../services/session.services';
import { logger } from '../utils/logger';

export default async function deserialiseUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = (req.headers.authorization ||
			req.headers.Authorization) as string | undefined;

		if (!authHeader?.startsWith('Bearer ')) return next();

		const accessToken = authHeader.split('Bearer ')[1];

		const refreshToken = req.cookies['refreshToken'] as string | undefined;

		if (!accessToken) return next();

		const { data, isExpired } = verifyJwt<PublicUser>(accessToken, 'access');

		if (data && !isExpired) {
			res.locals.user = data;
			return next();
		}

		if (isExpired && refreshToken) {
			logger.info('Access token expired, trying to refresh...');
			const newAccessToken = await refreshAccessToken(refreshToken);

			if (newAccessToken) {
				res.setHeader('Authorization', `Bearer ${newAccessToken}`);

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
