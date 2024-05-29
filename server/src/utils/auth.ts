import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from '../db';
import { sessions, users } from '../db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users); // your adapter

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getSessionAttributes: attributes => {
		return {};
	},
	getUserAttributes: attributes => {
		return {
			givenName: attributes.givenName,
			familyName: attributes.familyName,
			email: attributes.email,
			picture: attributes.picture,
			isVerified: attributes.isVerified,
		};
	},
});

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
	interface DatabaseSessionAttributes {}
	interface DatabaseUserAttributes {
		givenName: string;
		familyName: string;
		email: string;
		picture?: string;
		isVerified: boolean;
	}
}
