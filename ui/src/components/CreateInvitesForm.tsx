'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import StatusMessage from './StatusMessage';
import {
	CreateInvitesInput,
	createInvitesInputSchema,
} from '@/schemas/invite.schemas';
import { createInvites } from '@/actions/invite.actions';
import { Textarea } from './ui/textarea';
import CreateInvitesResponse from './CreateInvitesResponse';
import { CreateInviteResponse } from '@/types/invite';

export default function CreateInvitesForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [responseData, setResponseData] = useState<CreateInviteResponse | null>(
		null
	);

	const router = useRouter();
	const searchParams = useSearchParams();

	const form = useForm<CreateInvitesInput>({
		resolver: zodResolver(createInvitesInputSchema),
		defaultValues: {
			groupId: searchParams.get('groupId') ?? '',
			emails: [{ email: '' }],
			message: undefined,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'emails',
	});

	const { isSubmitting, isSubmitSuccessful } = form.formState;

	async function onSubmit(values: CreateInvitesInput) {
		setErrorMessage(null);

		try {
			const response = await createInvites(values);

			if ('error' in response) {
				throw response.error;
			}

			setResponseData(response);
		} catch (e: any) {
			setErrorMessage(e?.response?.data?.message ?? 'Something went wrong');
		}
	}

	if (isSubmitSuccessful && !!responseData)
		return <CreateInvitesResponse data={responseData} />;

	return (
		<Form {...form}>
			{errorMessage ? (
				<StatusMessage
					variant='destructive'
					title='Failed to send invites'
					description={errorMessage}
				/>
			) : null}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<FormField
					control={form.control}
					name='groupId'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type='hidden' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{fields.map((field, index) => (
					<FormField
						key={field.id}
						control={form.control}
						name={`emails.${index}.email`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email {index + 1}</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input type='email' {...field} />
										<Button
											variant='destructive'
											type='button'
											onClick={() => remove(index)}
										>
											Remove
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<div className='flex justify-end'>
					<Button
						type='button'
						variant='secondary'
						onClick={() => append({ email: '' })}
					>
						Add Email
					</Button>
				</div>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isSubmitting} type='submit'>
					Invite
				</Button>
			</form>
		</Form>
	);
}
