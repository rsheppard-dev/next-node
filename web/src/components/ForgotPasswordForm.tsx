'use client';

import {
	ForgotPasswordInput,
	forgotPasswordInputSchema,
} from '@/schemas/user.schemas';
import { forgotPasswordAction } from '@/actions/user.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import StatusMessage from './StatusMessage';
import { useAction } from 'next-safe-action/hooks';

export default function ForgotPasswordForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordInputSchema),
		defaultValues: {
			email: '',
		},
	});

	const { execute, status } = useAction(forgotPasswordAction, {
		onSuccess: (_, { email }) => {
			router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
		},
		onError: ({ fetchError, serverError }) => {
			setErrorMessage(fetchError ?? serverError ?? 'Something went wrong.');
		},
	});

	function onSubmit(values: ForgotPasswordInput) {
		setErrorMessage(null);
		execute(values);
	}

	return (
		<Form {...form}>
			{errorMessage ? (
				<StatusMessage
					variant='destructive'
					title='Something went wrong'
					description={errorMessage}
				/>
			) : null}

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex items-end gap-4 '
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									disabled={status === 'executing'}
									type='email'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={status === 'executing'}>
					Submit
				</Button>
			</form>
		</Form>
	);
}
