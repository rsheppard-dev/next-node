'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { LoginInput, loginInputSchema } from '@/schemas/session.schemas';
import fetcher from '@/utils/fetcher';
import { revalidatePath } from 'next/cache';
import { action } from '@/utils/safe-action';
import type { SessionCookie, SessionResponse } from '@/types/session';
import { redirect } from 'next/navigation';

export const loginAction = action(loginInputSchema, login);

async function login(credentials: LoginInput) {
	try {
		const data = await fetcher<SessionResponse>('/api/sessions', {
			method: 'POST',
			body: credentials,
		});

		const { name, value, attributes } = data.cookie;

		cookies().set(name, value, attributes);

		revalidatePath('/');

		return data.user;
	} catch (error) {
		throw error;
	}
}

export async function logout() {
	try {
		const cookie = await fetcher<SessionCookie>('/api/sessions', {
			method: 'DELETE',
		});

		const { name, value, attributes } = cookie;

		cookies().set(name, value, attributes);

		redirect('/');
	} catch (error) {
		console.log('Error logging out', error);
		throw error;
	}
}

export const getSession = cache(async () => {
	const sessionId = cookies().get('auth_session');

	let user = null;
	let session = null;
	let isLoggedIn = false;

	if (!sessionId)
		return {
			isLoggedIn,
			user,
			session,
		};

	try {
		const { cookie, ...data } = await fetcher<SessionResponse>(`/api/sessions`);

		user = data.user;
		session = data.session;
		isLoggedIn = !!user && !!session;

		if (session && session.fresh) {
			cookies().set(cookie.name, cookie.value, cookie.attributes);
		}
		if (!session) {
			cookies().set(cookie.name, cookie.value, cookie.attributes);
		}
	} catch {
		console.log('Error getting session');
	}

	return { isLoggedIn, user, session };
});
