'use client';

import { getGroup } from '@/actions/group.actions';
import { Group } from '@/types/group';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Badge } from './ui/badge';
import GroupMemberTable from './GroupMemberTable';
import Link from 'next/link';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import StatusMessage from './StatusMessage';

type Props = {
	id: string;
};

export default function GroupProfile({ id }: Props) {
	const [statusMessage, setStatusMessage] = useState<{
		variant: 'destructive' | 'default';
		title: string;
		description: string;
	} | null>(null);
	const { data: group, isPending } = useQuery<Group>({
		queryKey: ['group', id],
		queryFn: () => getGroup(id),
	});

	if (isPending) return <div>Loading group profile...</div>;

	if (!group) return notFound();
	return (
		<section className='space-y-6'>
			<div className='flex items-center gap-2'>
				<h1 className='font-bold text-2xl'>{group.name}</h1>
				<Badge variant='outline'>{group.role}</Badge>
			</div>
			{!!group?.description && <p>{group.description}</p>}

			{group.role === 'admin' && (
				<div className='flex justify-end'>
					<Link href={`/invites/create?groupId=${group.id}`}>
						<Button variant='outline' className='flex items-center gap-1'>
							<Plus aria-hidden /> Invite Member
						</Button>
					</Link>
				</div>
			)}
			{!!statusMessage && (
				<StatusMessage
					variant={statusMessage.variant}
					title={statusMessage.title}
					description={statusMessage.description}
				/>
			)}
			<GroupMemberTable
				members={group.members}
				group={group}
				setStatusMessage={setStatusMessage}
			/>
		</section>
	);
}
