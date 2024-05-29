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
import { VerifyUserInput, verifyUserInputSchema } from '@/schemas/user.schemas';
import { useSearchParams } from 'next/navigation';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import StatusMessage from './StatusMessage';
import { isAxiosError } from 'axios';
import { verifyUser } from '@/actions/user.actions';

export default function VerifyUserForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const searchParams = useSearchParams();
	const router = useRouter();

	const id = searchParams.get('id') || '';
	const code = searchParams.get('code') || '';

	const form = useForm<VerifyUserInput>({
		resolver: zodResolver(verifyUserInputSchema),
		defaultValues: {
			id,
			code,
		},
	});

	const { isSubmitting } = form.formState;
	const watchedCode = form.watch('code');

	const onSubmit = useCallback(
		async (values: VerifyUserInput) => {
			setErrorMessage(null);
			try {
				await verifyUser(values);
				const message = 'Your email has been verified.';
				router.push(`/login?message=${encodeURIComponent(message)}`);
			} catch (error) {
				if (error instanceof Error) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage('Something went wrong. Unable to verify user.');
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
