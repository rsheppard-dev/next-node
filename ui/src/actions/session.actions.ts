'use server';

import { cookies } from 'next/headers';
import { getIronSession, IronSession, sealData } from 'iron-session';
import { sessionOptions } from '../../config/session.config';
import { loginInputSchema } from '@/schemas/session.schemas';
import { User } from '@/types/user';
import { action, authAction } from '@/utils/safe-action';
import fetcher from '@/utils/fetcher';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { defaultSession } from '@/utils/defaults';

export async function getSession() {
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	if (!session.isLoggedIn) session.isLoggedIn = defaultSession.isLoggedIn;

	return session;
}

export const loginAction = action(loginInputSchema, async credentials => {
	try {
		const session = await getSession();

		const data = await fetcher<
			User & { accessToken: string; tokenExpiry: Date }
		>('/api/sessions', {
			method: 'POST',
			body: credentials,
		});

		session.id = data.sessionId;
		session.userId = data.id;
		session.givenName = data.givenName;
		session.familyName = data.familyName;
		session.email = data.email;
		session.picture = data.picture;
		session.accessToken = data.accessToken;
		session.tokenExpiry = data.tokenExpiry;
		session.isLoggedIn = true;

		await session.save();

		const { save, updateConfig, destroy, ...sessionResponse } = session;

		revalidatePath('/');

		return sessionResponse as SessionData;
	} catch (error) {
		throw error;
	}
});

export const logoutAction = authAction(z.object({}), async (_, session) => {
	try {
		// delete session from database
		await deleteSession();

		// destroy session cookie
		session.destroy();

		revalidatePath('/');
	} catch (error) {
		console.log('Error logging out', error);
		throw error;
	}
});

export async function deleteSession() {
	const cookie = cookies().get('sg.session');

	try {
		await fetcher('/api/sessions', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				Cookie: `${cookie?.name}=${cookie?.value}`,
			},
		});

		revalidatePath('/');
	} catch (error) {
		console.log('Error deleting session', error);
		throw error;
	}
}

export async function getSessionData() {
	try {
		const cookie = cookies().get('sg.session');

		const session = await fetcher<SessionResponse>('/api/sessions', {
			credentials: 'include',
			headers: {
				Cookie: `${cookie?.name}=${cookie?.value}`,
			},
			next: {
				tags: ['session'],
			},
		});

		return session;
	} catch (error) {
		console.log('Error getting refresh token', error);
		throw error;
	}
}

export async function updateSession(session: IronSession<SessionData>) {
	try {
		const { refreshToken, expiresIn } = await getSessionData();

		const sessionExpired = new Date(expiresIn) < new Date();

		if (!refreshToken || sessionExpired) return null;

		const accessToken = await refreshSession(refreshToken);

		if (!accessToken) return null;

		const newSession = await sealData(
			{
				...session,
				accessToken: accessToken,
				tokenExpiry: new Date(Date.now() + 1000 * 10),
			},
			sessionOptions
		);

		return newSession;
	} catch (error) {
		throw error;
	}
}

export async function refreshSession(
	refreshToken: string
): Promise<string | undefined> {
	try {
		const { accessToken } = await fetcher<{ accessToken: string }>(
			`/api/sessions/refresh/${refreshToken}`
		);

		return accessToken;
	} catch (error) {
		console.log('Error refreshing token', error);
		throw error;
	}
}
