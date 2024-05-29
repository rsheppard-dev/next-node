import { NextFunction, Request, Response } from 'express';
import { lucia } from '../utils/auth';

export default async function deserialiseUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	res.locals.user = user;
	res.locals.session = session;

	return next();
}
