import e, { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { User } from '../db/schema';
import { refreshAccessToken } from '../services/session.services';
import { env } from '../../config/env';

export default async function deserialiseUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const accessToken =
		req.cookies['accessToken'] ||
		(req.headers.authorization || '').split(' ')[1];

	const refreshToken =
		req.cookies['refreshToken'] || (req.headers['x-refresh'] as string);

	if (!accessToken) return next();

	const { data, isExpired } = verifyJwt<User & { sessionId: string }>(
		accessToken,
		'access'
	);

	if (data) {
		res.locals.user = data;
		return next();
	}

	if (isExpired && refreshToken) {
		const newAccessToken = await refreshAccessToken(refreshToken);

		if (newAccessToken) {
			res.setHeader('Authorization', `Bearer ${newAccessToken}`);

			res.cookie('accessToken', accessToken, {
				maxAge: 15 * 60 * 1000, // 15 minutes
				httpOnly: true,
				domain: 'localhost',
				secure: env.NODE_ENV === 'production',
			});

			const { data: newData } = verifyJwt<User & { sessionId: string }>(
				newAccessToken,
				'access'
			);

			res.locals.user = newData;
		}
	}

	return next();
}
