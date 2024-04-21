import { Group } from '@/types/group';
import React from 'react';
import { TableCell, TableRow } from './ui/table';
import { Delete, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteGroup } from '@/services/group.services';
import Link from 'next/link';

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
			<TableCell className='font-medium'>{group.name}</TableCell>
			<TableCell>{group.description}</TableCell>
			<TableCell className='flex justify-end items-center gap-2'>
				{group.role === 'admin' ? (
					<>
						<Link href={`/groups/edit?id=${group.id}`} title='Edit Group'>
							<Edit aria-hidden />
						</Link>
						<Button
							variant='ghost'
							title='Delete Group'
							onClick={() => deleteMutation.mutate(group.id)}
						>
							<Delete aria-hidden />
						</Button>
					</>
				) : null}
			</TableCell>
		</TableRow>
	);
}
