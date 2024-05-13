import { SessionOptions } from 'iron-session';
import { env } from './env';
import { SessionData } from '@/types/session';

export const sessionOptions: SessionOptions = {
	password: env.SESSION_SECRET,
	cookieName: 'sg.session',
	cookieOptions: {
		secure: env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 365,
	},
};

export const defaultSession: SessionData = {
	id: '',
	userId: '',
	givenName: '',
	familyName: '',
	email: '',
	picture: '',
	accessToken: '',
	tokenExpiry: new Date(0),
	isLoggedIn: false,
};
