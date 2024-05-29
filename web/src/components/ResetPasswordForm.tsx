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
import StatusMessage from './StatusMessage';
import { resetPasswordAction } from '@/actions/user.actions';
import { useAction } from 'next-safe-action/hooks';

export default function ResetPasswordForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const { execute, status } = useAction(resetPasswordAction, {
		onSuccess: () => {
			const message = 'Password reset successfully.';
			router.push(`/login?message=${encodeURIComponent(message)}`);
		},
		onError: ({ fetchError, serverError }) => {
			if (!!serverError) {
				setErrorMessage(serverError);
			} else if (!!fetchError) {
				setErrorMessage(fetchError);
			} else {
				setErrorMessage('Something went wrong.');
			}
		},
	});

	const email = searchParams.get('email') || '';
	const ResetPasswordCode = searchParams.get('code') || '';

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordInputSchema),
		defaultValues: {
			email,
			ResetPasswordCode,
			password: '',
			confirmPassword: '',
		},
	});

	const { isSubmitting } = form.formState;

	function onSubmit(values: ResetPasswordInput) {
		setErrorMessage(null);
		execute(values);
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
				<input type='hidden' {...form.register('email')} value={email} />
				<input
					type='hidden'
					{...form.register('ResetPasswordCode')}
					value={ResetPasswordCode}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									disabled={status === 'executing'}
									type='password'
									{...field}
								/>
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
								<Input
									disabled={status === 'executing'}
									type='password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={status === 'executing'} type='submit'>
					Change Password
				</Button>
			</form>
		</Form>
	);
}
