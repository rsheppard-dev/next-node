import { SessionOptions } from 'iron-session';
import { env } from './env';

export const sessionOptions: SessionOptions = {
	password: env.SESSION_SECRET,
	cookieName: 'sg.session',
	cookieOptions: {
		secure: env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 1000 * 60 * 60 * 24 * 365,
	},
};

export type SessionData = {
	id: string;
	userId: string;
	givenName: string;
	familyName: string;
	email: string;
	picture?: string;
	isLoggedIn: boolean;
	accessToken: string;
	tokenExpiry: Date;
};
