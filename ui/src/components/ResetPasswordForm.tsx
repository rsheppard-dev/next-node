'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	ResetPasswordInput,
	resetPasswordInputSchema,
} from '@/schemas/user.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { isAxiosError } from 'axios';
import StatusMessage from './StatusMessage';
import { resetPassword } from '@/services/user.services';

export default function ResetPasswordForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	const id = searchParams.get('id') || '';
	const code = searchParams.get('code') || '';

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordInputSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: ResetPasswordInput) {
		setErrorMessage(null);

		try {
			await resetPassword(values, id, code);
			const message = 'Password reset successfully.';
			router.push(`/login?message=${encodeURIComponent(message)}`);
		} catch (error) {
			if (isAxiosError(error)) {
				setErrorMessage(error.response?.data?.message);
			} else {
				setErrorMessage('An unknown error occurred');
			}
		}
	}
	return (
		<Form {...form}>
			{errorMessage ? (
				<StatusMessage
					variant='destructive'
					title='Failed to change password'
					description={errorMessage}
				/>
			) : null}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm New Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isSubmitting} type='submit'>
					Change Password
				</Button>
			</form>
		</Form>
	);
}
