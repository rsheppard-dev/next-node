import { Group } from '@/types/group';
import React from 'react';
import { TableCell, TableRow } from './ui/table';
import { Delete, Edit, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteGroup } from '@/actions/group.actions';
import Link from 'next/link';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
	group: Group;
};

export default function GroupTableRow({ group }: Props) {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteGroup(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups'] });
		},
	});
	return (
		<TableRow>
			<TableCell className='font-medium'>
				<Link href={`/groups/${group.id}`}>{group.name}</Link>
			</TableCell>
			<TableCell>{group.description}</TableCell>
			<TableCell className='flex justify-end items-center'>
				<Button asChild variant='ghost' className='px-2 py-1'>
					<Link href={`/groups/${group.id}`} title='Group Information'>
						<Info aria-hidden />
					</Link>
				</Button>
				{group.role === 'admin' ? (
					<>
						<Button asChild variant='ghost' className='px-2 py-1'>
							<Link href={`/groups/edit?id=${group.id}`} title='Edit Group'>
								<Edit aria-hidden />
							</Link>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='ghost'
									title='Delete Group'
									className='px-2 py-1'
								>
									<Delete aria-hidden />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										this group and remove all associated members.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteMutation.mutate(group.id)}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				) : null}
			</TableCell>
		</TableRow>
	);
}
