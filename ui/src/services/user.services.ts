import {
	CreateUserInput,
	ForgotPasswordInput,
	ResetPasswordInput,
	VerifyResetPasswordCodeInput,
	VerifyUserInput,
} from '@/schemas/user.schemas';
import { User } from '@/types/user';
import axios, { axiosAuth } from '@/utils/axios';

export async function createUser(values: CreateUserInput) {
	try {
		const response = await axios.post<User>('/api/users', values);

		return response.data;
	} catch (error) {
		console.log('Failed to register user', error);
		throw error;
	}
}

export async function verifyUser(values: VerifyUserInput) {
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
		const response = await axios.post<{ message: string }>(
			'/api/users/forgot-password',
			values
		);

		return response.data;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}

export async function verifyResetPasswordCode(
	values: VerifyResetPasswordCodeInput
) {
	try {
		const response = await axios.get<{ isValid: boolean; message: string }>(
			`/api/users/forgot-password/verify/${encodeURIComponent(
				values.email
			)}/${encodeURIComponent(values.code)}`
		);

		return response.data;
	} catch (error) {
		console.log('Failed to verify user', error);
		throw error;
	}
}

export async function resetPassword(values: ResetPasswordInput) {
	try {
		const response = await axios.post<User>(
			`/api/users/reset-password`,
			values
		);

		return response.data;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}

export async function getCurrentUser() {
	try {
		const response = await axiosAuth.get<User>('/api/users/me');

		return response.data;
	} catch (error) {
		console.log('Failed to get current user', error);
		throw error;
	}
}
