import { NextFunction, Request, Response } from 'express';

export default function requireUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const user = res.locals.user;
	const session = res.locals.session;

	if (user && session) return next();

	return res.status(403).send({
		statusCode: 403,
		message: 'You must be logged in to access this resource.',
	});
}
