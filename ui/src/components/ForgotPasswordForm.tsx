'use client';

import {
	ForgotPasswordInput,
	forgotPasswordInputSchema,
} from '@/schemas/user.schemas';
import { forgotPassword } from '@/services/user.services';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
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

export default function ForgotPasswordForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordInputSchema),
		defaultValues: {
			email: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: ForgotPasswordInput) {
		setErrorMessage(null);
		try {
			const response = await forgotPassword(values);

			if (!response?.userId) throw Error();

			router.push(`/forgot-password/verify?id=${response.userId}`);
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
					title='Something went wrong'
					description={errorMessage}
				/>
			) : null}

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isSubmitting}>
					Submit
				</Button>
			</form>
		</Form>
	);
}
