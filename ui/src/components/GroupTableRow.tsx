import { Group } from '@/types/group';
import React from 'react';
import { TableCell, TableRow } from './ui/table';
import { Edit, Info } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import DeleteGroupButton from './DeleteGroupButton';

type Props = {
	group: Group;
};

export default function GroupTableRow({ group }: Props) {
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

						<DeleteGroupButton groupId={group.id} />
					</>
				) : null}
			</TableCell>
		</TableRow>
	);
}
