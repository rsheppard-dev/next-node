import { Group } from '@/types/group';
import React from 'react';
import { TableCell, TableRow } from './ui/table';
import { Delete, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteGroup } from '@/services/group.services';

type Props = {
	group: Group;
};

export default function GroupTableRow({ group }: Props) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: string) => deleteGroup(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups'] });
		},
	});
	return (
		<TableRow>
			<TableCell className='font-medium'>{group.name}</TableCell>
			<TableCell>{group.description}</TableCell>
			<TableCell className='flex justify-end items-center gap-2'>
				<Edit />
				<Button
					variant='ghost'
					title='Delete Group'
					onClick={() => mutation.mutate(group.id)}
				>
					<Delete aria-hidden />
				</Button>
			</TableCell>
		</TableRow>
	);
}
