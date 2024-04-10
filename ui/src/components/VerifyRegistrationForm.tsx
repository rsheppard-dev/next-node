'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { VerifyInput, verifyInputSchema } from '@/schemas/user.schemas';
import { useSearchParams } from 'next/navigation';
import Spinner from './Spinner';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { verifyNewUser } from '@/services/user.services';
import StatusMessage from './StatusMessage';

export default function VerifyRegistrationForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const searchParams = useSearchParams();
	const router = useRouter();

	const id = searchParams.get('id') || '';
	const code = searchParams.get('code') || '';

	const form = useForm<VerifyInput>({
		resolver: zodResolver(verifyInputSchema),
		defaultValues: {
			id,
			code,
		},
	});

	const { isSubmitting } = form.formState;
	const watchedCode = form.watch('code');

	const onSubmit = useCallback(
		async (values: VerifyInput) => {
			setErrorMessage(null);
			try {
				await verifyNewUser(values);
				const message = 'Your account has been verified.';
				router.push(`/login?message=${encodeURIComponent(message)}`);
			} catch (error) {
				if (isAxiosError(error)) {
					setErrorMessage(error.response?.data?.message);
				} else {
					setErrorMessage('An unknown error occurred');
				}
			}
		},
		[router]
	);

	useEffect(() => {
		if (watchedCode && watchedCode.length === 6) {
			form.handleSubmit(onSubmit)();
		}
	}, [watchedCode, onSubmit, form]);
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-2/3 space-y-6 mb-6'
			>
				<input type='hidden' {...form.register('id')} value={id} />
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Verification Code</FormLabel>
							<FormControl>
								<InputOTP maxLength={6} {...field}>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormDescription>
								Please enter the verification code sent to your email.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{isSubmitting ? <Spinner /> : null}

				{errorMessage ? (
					<StatusMessage
						variant='destructive'
						title="That's not quite right..."
						description={errorMessage}
					/>
				) : null}
			</form>
		</Form>
	);
}
