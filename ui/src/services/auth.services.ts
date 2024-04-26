import { LoginInput } from '@/schemas/session.schemas';
import { User } from '@/types/user';
import axios from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';

export async function login(values: LoginInput) {
	try {
		const {
			data: { accessToken },
		} = await axios.post<{ accessToken: string }>('/api/sessions', values);

		if (!accessToken) return;

		return jwtDecode<User>(accessToken);
	} catch (error) {
		console.log('Error logging in', error);
		throw error;
	}
}

export async function logout() {
	try {
		return await axios.delete('/api/sessions');
	} catch (error) {
		console.log('Error logging out', error);
		throw error;
	}
}
