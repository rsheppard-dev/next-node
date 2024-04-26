'use client';

import { getGroup } from '@/services/group.services';
import { Group } from '@/types/group';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Badge } from './ui/badge';

type Props = {
	id: string;
};

export default function GroupProfile({ id }: Props) {
	const { data: group, isPending } = useQuery<Group>({
		queryKey: ['group', id],
		queryFn: () => getGroup(id as string),
	});

	if (isPending) return <div>Loading group profile...</div>;

	if (!group) return notFound();

	console.log(group);

	return (
		<section className='space-y-6'>
			<div className='flex items-center gap-2'>
				<h1 className='font-bold text-2xl'>{group.name}</h1>
				<Badge variant='outline'>{group.role}</Badge>
			</div>
			{!!group?.description && <p>{group.description}</p>}
		</section>
	);
}
