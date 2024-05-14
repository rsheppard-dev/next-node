'use server';

import { cookies } from 'next/headers';
import { getIronSession, IronSession, sealData } from 'iron-session';
import { SessionData, SessionResponse } from '@/types/session';
import { defaultSession, sessionOptions } from '../../config/session.config';
import { LoginInput, loginInputSchema } from '@/schemas/session.schemas';
import { env } from '../../config/env';
import { User } from '@/types/user';
import { action } from '@/utils/safe-action';
import axios from '@/utils/axios';

export async function getSession() {
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	if (!session.isLoggedIn) session.isLoggedIn = defaultSession.isLoggedIn;

	return session;
}

export const loginAction = action(loginInputSchema, async credentials => {
	try {
		const session = await getSession();

		const response = await axios.post<
			User & { accessToken: string; tokenExpiry: Date }
		>('/api/sessions', credentials);

		const data = response.data;

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
	} catch (error) {
		throw error;
	}
});

export async function logout() {
	try {
		const session = await getSession();

		await deleteSession(session.id);

		session.destroy();
	} catch (error) {
		console.log('Error logging out', error);
		throw error;
	}
}

export async function deleteSession(sessionId: string) {
	try {
		await fetch(
			`${env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/${sessionId}`,
			{
				method: 'DELETE',
			}
		);
	} catch (error) {
		console.log('Error deleting session', error);
		throw error;
	}
}

export async function getSessionData() {
	try {
		const session = await getSession();

		const response = await fetch(
			env.NEXT_PUBLIC_SERVER_ENDPOINT + '/api/sessions/' + session.id,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		const data = (await response.json()) as SessionResponse;

		return data;
	} catch (error) {
		console.log('Error getting refresh token', error);
		throw error;
	}
}

export async function updateSession(session: IronSession<SessionData>) {
	try {
		const { token, expiresIn } = await getSessionData();

		const sessionExpired = new Date(expiresIn) < new Date();

		if (!token || sessionExpired) return null;

		const accessToken = await refreshSession(token);

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
		console.log(error);
		await logout();
	}
}

export async function refreshSession(
	refreshToken: string
): Promise<string | undefined> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/refresh/${refreshToken}`
		);

		const { accessToken } = await response.json();

		return accessToken;
	} catch (error) {
		console.log('Error refreshing token', error);
		throw error;
	}
}
