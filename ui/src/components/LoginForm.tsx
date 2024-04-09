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
import { isAxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoginInput, loginInputSchema } from '@/schemas/session.schemas';
import { useSessionSelectors } from '@/stores/session.store';

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useSessionSelectors.use.login();

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	console.log(searchParams.get('from'));

	async function onSubmit(values: LoginInput) {
		setIsSubmitting(true);
		setErrorMessage(null);
		try {
			await login(values);

			const destination = searchParams.get('from') || '/';
			router.push(destination);
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
