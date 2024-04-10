import {
	ForgotPasswordInput,
	RegistrationInput,
	ResetPasswordInput,
	VerifyInput,
} from '@/schemas/user.schemas';
import { User } from '@/types/user';
import axios from '@/utils/axios';

export async function registerUser(values: RegistrationInput) {
	try {
		const response = await axios.post<User>('/api/users', values);

		return response.data;
	} catch (error) {
		console.log('Failed to register user', error);
		throw error;
	}
}

export async function verifyNewUser(values: VerifyInput) {
	try {
		const response = await axios.get<{ message: string }>(
			`/api/users/verify/${values.id}/${values.code}`
		);

		return response.data;
	} catch (error) {
		console.log('Failed to verify user', error);
		throw error;
	}
}

export async function forgotPassword(values: ForgotPasswordInput) {
	try {
		const response = await axios.post<{ userId: string; message: string }>(
			'/api/users/forgot-password',
			values
		);

		return response.data;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}

export async function verifyUser(values: VerifyInput) {
	try {
		const response = await axios.get<{ isValid: boolean; message: string }>(
			`/api/users/forgot-password/${values.id}/${values.code}`
		);

		return response.data;
	} catch (error) {
		console.log('Failed to verify user', error);
		throw error;
	}
}

export async function resetPassword(
	values: ResetPasswordInput,
	userId: string,
	passwordResetCode: string
) {
	try {
		const response = await axios.post<User>(
			`/api/users/reset-password/${userId}/${passwordResetCode}`,
			values
		);

		return response.data;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}
