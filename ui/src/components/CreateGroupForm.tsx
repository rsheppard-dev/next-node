'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import StatusMessage from './StatusMessage';
import {
	CreateGroupInput,
	createGroupInputSchema,
} from '@/schemas/group.schemas';
import { createGroupAction } from '@/actions/group.actions';
import { useAction } from 'next-safe-action/hooks';

export default function CreateGroupForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const { execute, status } = useAction(createGroupAction, {
		onSuccess() {
			router.push('/groups');
		},
		onError({ fetchError, serverError }) {
			const error =
				fetchError ??
				serverError ??
				'Unable to validate credentials. Please try again.';

			setErrorMessage(error);
		},
	});

	const form = useForm<CreateGroupInput>({
		resolver: zodResolver(createGroupInputSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	function onSubmit(values: CreateGroupInput) {
		setErrorMessage(null);
		execute(values);
	}
	return (
		<Form {...form}>
			{errorMessage ? (
				<StatusMessage
					variant='destructive'
					title='Failed to create group'
					description={errorMessage}
				/>
			) : null}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Group Name</FormLabel>
							<FormControl>
								<Input disabled={status === 'executing'} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input disabled={status === 'executing'} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={status === 'executing'} type='submit'>
					Create
				</Button>
			</form>
		</Form>
	);
}
