import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export type SessionUser = {
	id: string;
	givenName: string;
	familyName: string;
	email: string;
	picture?: string;
};

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
	fresh: boolean;
};

export type SessionCookie = {
	name: string;
	value: string;
	attributes: Partial<ResponseCookie> | undefined;
};

export type SessionResponse = {
	user: SessionUser;
	session: Session;
	cookie: SessionCookie;
};
