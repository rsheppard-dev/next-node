import axios from '@/utils/axios';

export async function forgotPassword(email: string) {
	try {
		return await axios.post<{ message: string }>('/api/users/forgot-password', {
			email,
		});
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}
