'use client';

import { useEffect, useState } from 'react';
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
import StatusMessage from './StatusMessage';
import {
	UpdateGroupInput,
	updateGroupInputSchema,
} from '@/schemas/group.schemas';
import { updateGroup, getGroup } from '@/services/group.services';
import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types/group';

export default function EditGroupForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');

	const {
		data: group,
		isPending,
		isError,
		error,
	} = useQuery<Group>({
		queryKey: ['group', id],
		queryFn: () => getGroup(id!),
		enabled: id !== null,
	});

	const form = useForm<UpdateGroupInput>({
		resolver: zodResolver(updateGroupInputSchema),
		defaultValues: {
			id: group?.id,
			name: group?.name,
			description: group?.description,
		},
	});

	useEffect(() => {
		form.reset({
			id: group?.id,
			name: group?.name,
			description: group?.description,
		});
	}, [group, form]);

	const { isSubmitting } = form.formState;

	async function onSubmit(values: UpdateGroupInput) {
		setErrorMessage(null);

		try {
			const response = await updateGroup(values);

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
					title='Failed to update group'
					description={errorMessage}
				/>
			) : null}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='max-w-md space-y-4'
			>
				<Input type='hidden' {...form.register('id')} />
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
					Update
				</Button>
			</form>
		</Form>
	);
}
