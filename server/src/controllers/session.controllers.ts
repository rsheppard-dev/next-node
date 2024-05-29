import { Request, Response } from 'express';
import { CreateSessionBody } from '../schemas/session.schemas';
import {
	getUserByEmail,
	removePrivateUserProps,
} from '../services/user.services';
import { validatePassword } from '../services/session.services';
import { lucia } from '../utils/auth';

export async function createSessionHandler(
	req: Request<{}, {}, CreateSessionBody>,
	res: Response
) {
	const { email, password } = req.body;
	const message = 'Incorrect email or password. Please try again.';

	try {
		const user = await getUserByEmail(email);

		if (!user || !user.password)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

		if (!user.isVerified)
			return res.status(403).send({
				statusCode: 403,
				message: 'Email has not been verified. Please check your email.',
			});

		const isPasswordValid = await validatePassword(password, user.password);

		if (!isPasswordValid)
			return res.status(401).send({
				statusCode: 401,
				message,
			});

		const session = await lucia.createSession(user.id, {
			userAgent: req.get('user-agent') as string,
			expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
		});

		const cookie = lucia.createSessionCookie(session.id);

		return res.status(201).send({
			user: removePrivateUserProps(user),
			session,
			cookie,
		});
	} catch (error) {
		console.log('error', error);
		return res.status(500).send({
			statusCode: 500,
			message: 'Something went wrong. Failed to create session.',
		});
	}
}

export async function deleteSessionHandler(req: Request, res: Response) {
	try {
		if (!res.locals.session)
			return res.status(401).send({ message: 'No session found.' });

		await lucia.invalidateSession(res.locals.session.id);

		const cookie = lucia.createBlankSessionCookie();

		return res.status(200).send(cookie);
	} catch (error) {
		return res.status(500).send({
			statusCode: 500,
			message: 'Failed to invalidate session.',
		});
	}
}

export async function getSessionHandler(req: Request, res: Response) {
	console.log('hi session');
	if (!res.locals.session)
		return res.status(401).send({ message: 'No session found.' });

	let cookie;

	try {
		if (res.locals.session.fresh) {
			cookie = lucia.createSessionCookie(res.locals.session.id);
		}

		if (!res.locals.session) {
			cookie = lucia.createBlankSessionCookie();
		}

		return res
			.status(200)
			.send({ session: res.locals.session, user: res.locals.user, cookie });
	} catch (error) {}
}
