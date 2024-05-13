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
import { createUser } from '@/actions/user.actions';
import {
	CreateGroupInput,
	createGroupInputSchema,
} from '@/schemas/group.schemas';
import { createGroup } from '@/actions/group.actions';

export default function CreateGroupForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<CreateGroupInput>({
		resolver: zodResolver(createGroupInputSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: CreateGroupInput) {
		setErrorMessage(null);

		try {
			const response = await createGroup(values);

			if ('error' in response) {
				throw response.error;
			}

			router.push('/groups');
		} catch (e: any) {
			setErrorMessage(e?.response?.data?.message ?? 'Something went wrong');
		}
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
								<Input {...field} />
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
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isSubmitting} type='submit'>
					Create
				</Button>
			</form>
		</Form>
	);
}
