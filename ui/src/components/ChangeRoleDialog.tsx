'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Edit } from 'lucide-react';
import { GroupMember } from '@/types/groupMember';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Group, rolesEnum } from '@/types/group';
import {
	ChangeUserRoleInput,
	changeUserRoleInputSchema,
} from '@/schemas/group.schemas';
import { updateGroupRole } from '@/actions/group.actions';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	user: GroupMember;
	group: Group;
	setStatusMessage: Dispatch<
		SetStateAction<{
			variant: 'destructive' | 'default';
			title: string;
			description: string;
		} | null>
	>;
};
export default function ChangeRoleDialog({
	user,
	group,
	setStatusMessage,
}: Props) {
	const form = useForm<ChangeUserRoleInput>({
		resolver: zodResolver(changeUserRoleInputSchema),
		defaultValues: {
			userId: user.id,
			groupId: group.id,
			role: user.role,
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: ChangeUserRoleInput) {
		try {
			const response = await updateMutation.mutateAsync(values);

			if ('error' in response) {
				throw response.error;
			}

			setStatusMessage({
				variant: 'default',
				title: 'Success',
				description: `${user.givenName} ${user.familyName}'s role has been updated to ${response.role}.`,
			});
		} catch (e: any) {
			setStatusMessage({
				variant: 'destructive',
				title: 'Error',
				description: e?.response?.data?.message ?? 'Something went wrong',
			});
		}
	}

	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: (values: ChangeUserRoleInput) => updateGroupRole(values),
		mutationKey: ['group', group.id],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['group', group.id] });
		},
	});
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='ghost' className='px-2 py-1' title='Edit Role'>
					<Edit aria-hidden />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Role</DialogTitle>
					<DialogDescription>
						Make changes to {user.givenName} {user.familyName}&apos;s role.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<input type='hidden' {...form.register('userId')} />
						<input type='hidden' {...form.register('groupId')} />
						<FormField
							control={form.control}
							name='role'
							render={({ field }) => (
								<div className='flex items-end gap-4'>
									<FormItem>
										<FormLabel>Role</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} {...field}>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Select a role' />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Roles</SelectLabel>
														<SelectItem value={rolesEnum.admin}>
															Admin
														</SelectItem>
														<SelectItem value={rolesEnum.member}>
															Member
														</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
									<DialogFooter>
										<DialogClose asChild>
											<Button type='submit' disabled={isSubmitting}>
												Change Role
											</Button>
										</DialogClose>
									</DialogFooter>
								</div>
							)}
						/>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
