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
import useSession from '@/hooks/useSession';

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		loginMutation: { isPending, mutate: login },
	} = useSession();
	const searchParams = useSearchParams();

	const message = searchParams.get('message');

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: LoginInput) {
		setErrorMessage(null);
		login(values);
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
								<Input disabled={isPending} type='email' {...field} />
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
								<Input disabled={isPending} type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isPending}>
					Login
				</Button>
			</form>
		</Form>
	);
}
