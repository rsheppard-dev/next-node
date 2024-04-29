import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';
import { env } from '../../config/env';

export function getSession() {
	const accessToken = cookies().get('accessToken')?.value;

	if (!accessToken) return null;

	return jwtDecode<User>(accessToken);
}

export async function updateSession() {
	const accessToken = cookies().get('accessToken')?.value;

	try {
		if (!accessToken) {
			return await refreshSession();
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function refreshSession(): Promise<string | undefined> {
	const refreshToken = cookies().get('refreshToken')?.value;

	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/refresh`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refreshToken }),
			}
		);

		const { accessToken } = await response.json();

		return accessToken;
	} catch (error) {
		console.log('Error refreshing token', error);
		throw error;
	}
}
