'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { LoginInput, loginInputSchema } from '@/schemas/session.schemas';
import StatusMessage from './StatusMessage';
import { login } from '@/services/auth.services';
import { useSessionStore } from '@/app/store/session.store';

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const loginState = useSessionStore(state => state.login);

	const message = searchParams.get('message');

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: LoginInput) {
		setErrorMessage(null);
		try {
			await login(values);
			loginState();

			const destination = searchParams.get('from') || '/';
			router.push(destination);
		} catch (error: any) {
			setErrorMessage(
				error?.response?.data?.message ?? 'An unknown error occurred'
			);
			console.error(error);
		}
	}
	return (
		<Form {...form}>
			{message ? (
				<StatusMessage title='Please Login' description={message} />
			) : null}
			{errorMessage ? (
				<StatusMessage
					variant='destructive'
					title='Login Failed'
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
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isSubmitting}>
					Login
				</Button>
			</form>
		</Form>
	);
}
