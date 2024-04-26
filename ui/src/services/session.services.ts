import axios from '@/utils/axios';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';

export async function getSession() {
	const accessToken = cookies().get('accessToken')?.value;

	if (!accessToken) return null;

	return jwtDecode<User>(accessToken);
}

export async function updateSession() {
	const accessToken = cookies().get('accessToken')?.value;
	try {
		if (accessToken) return true;

		const newAccessToken = await refreshSession();

		return !!newAccessToken;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function refreshSession() {
	try {
		const response = await axios.get<{ accessToken: string }>(
			'/api/sessions/refresh'
		);

		return response.data.accessToken;
	} catch (error) {
		return null;
	}
}
