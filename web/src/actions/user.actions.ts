'use server';

import {
	CreateUserInput,
	createUserInputSchema,
	ForgotPasswordInput,
	forgotPasswordInputSchema,
	ResetPasswordInput,
	resetPasswordInputSchema,
	VerifyResetPasswordCodeInput,
	VerifyUserInput,
} from '@/schemas/user.schemas';
import fetcher from '@/utils/fetcher';
import { action } from '@/utils/safe-action';

export const createUserAction = action(createUserInputSchema, createUser);

async function createUser(values: CreateUserInput) {
	try {
		const user = await fetcher<User>('/api/users', {
			method: 'POST',
			body: values,
		});

		return user;
	} catch (error) {
		console.log('Failed to register user', error);
		throw error;
	}
}

export async function verifyUser(values: VerifyUserInput) {
	try {
		const response = await fetcher<{ message: string }>(
			`/api/users/verify/${values.id}/${values.code}`
		);

		return response;
	} catch (error) {
		console.log('Failed to verify user', error);
		throw error;
	}
}

export const forgotPasswordAction = action(
	forgotPasswordInputSchema,
	forgotPassword
);

async function forgotPassword(values: ForgotPasswordInput) {
	try {
		const response = await fetcher<{ message: string }>(
			'/api/users/forgot-password',
			{
				method: 'POST',
				body: values,
			}
		);

		return response;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}

export async function verifyResetPasswordCode(
	values: VerifyResetPasswordCodeInput
) {
	try {
		const response = await fetcher<{ isValid: boolean; message: string }>(
			`/api/users/forgot-password/verify/${encodeURIComponent(
				values.email
			)}/${encodeURIComponent(values.code)}`
		);

		return response;
	} catch (error) {
		console.log('Failed to verify user', error);
		throw error;
	}
}

export const resetPasswordAction = action(
	resetPasswordInputSchema,
	resetPassword
);

async function resetPassword(values: ResetPasswordInput) {
	try {
		const user = await fetcher<User>(`/api/users/reset-password`, {
			method: 'POST',
			body: values,
		});

		return user;
	} catch (error) {
		console.log('Failed to reset password', error);
		throw error;
	}
}

export async function getCurrentUser() {
	try {
		const user = await fetcher<User>('/api/users/me');

		return user;
	} catch (error) {
		console.log('Failed to get current user', error);
		throw error;
	}
}

export async function getUser(userId: string) {
	try {
		const user = await fetcher<User>(`/api/users/${userId}`);

		return user;
	} catch (error) {
		console.log('Failed to get user', error);
		return null;
	}
}
