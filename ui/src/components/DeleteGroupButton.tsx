'use client';

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
} from './ui/alert-dialog';
import { Delete } from 'lucide-react';
import { Button } from './ui/button';
import { deleteGroupAction } from '@/actions/group.actions';
import { useAction } from 'next-safe-action/hooks';

type Props = {
	groupId: string;
};

export default function DeleteGroupButton({ groupId }: Props) {
	const { execute } = useAction(deleteGroupAction);

	function handleDelete() {
		execute({ id: groupId });
	}
	return (
		<form action={handleDelete}>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant='ghost' title='Delete Group' className='px-2 py-1'>
						<Delete aria-hidden />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							group and remove all associated members.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</form>
	);
}
