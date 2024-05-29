'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import StatusMessage from '../StatusMessage';
import { loginAction } from '@/actions/session.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	const message = searchParams.get('message');
	const from = searchParams.get('from');

	const { execute, status } = useAction(loginAction, {
		onError: ({ serverError, fetchError }) => {
			if (!!serverError) {
				setErrorMessage(serverError);
			} else if (!!fetchError) {
				setErrorMessage(fetchError);
			} else {
				setErrorMessage('Something went wrong.');
			}
		},
		onSuccess: () => {
			setErrorMessage(null);
			const destination = from ? decodeURIComponent(from) : '/';
			router.push(destination);
		},
	});

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: LoginInput) {
		setErrorMessage(null);
		execute(values);
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
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
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
				<Button type='submit' disabled={status === 'executing'}>
					Login
				</Button>
			</form>
		</Form>
	);
}
