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
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Terminal } from 'lucide-react';

export default function ForgotPasswordForm() {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordInputSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: ForgotPasswordInput) {
		setIsSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);
		try {
			const response = await forgotPassword(values.email);
			setSuccessMessage(response.data.message);
		} catch (error) {
			if (isAxiosError(error)) {
				setErrorMessage(error.response?.data?.message);
			} else {
				setErrorMessage('An unknown error occurred');
			}
		}
		setIsSubmitting(false);
	}

	return (
		<Form {...form}>
			{errorMessage ? (
				<Alert variant='destructive' className='mb-10'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Sorry, login failed</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			) : null}

			{successMessage ? (
				<Alert variant='default' className='mb-10'>
					<Terminal className='h-4 w-4' />
					<AlertTitle>Thank you</AlertTitle>
					<AlertDescription>{successMessage}</AlertDescription>
				</Alert>
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
