'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	RegistrationInput,
	registrationInputSchema,
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
import { registerUser } from '@/services/user.services';
import StatusMessage from './StatusMessage';

export default function RegistrationForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<RegistrationInput>({
		resolver: zodResolver(registrationInputSchema),
		defaultValues: {
			givenName: '',
			familyName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: RegistrationInput) {
		setErrorMessage(null);

		try {
			const user = await registerUser(values);

			if (!user?.id) throw Error;

			router.push(`/register/verify?id=${user.id}`);
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
					title='Registration Failed'
					description={errorMessage}
				/>
			) : null}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<FormField
					control={form.control}
					name='givenName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='familyName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isSubmitting} type='submit'>
					Register
				</Button>
			</form>
		</Form>
	);
}
