import { Badge } from './ui/badge';
import GroupMemberTable from './GroupMemberTable';
import Link from 'next/link';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Group } from '@/types/group';

type Props = {
	group: Group;
};

export default async function GroupProfile({ group }: Props) {
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

			<GroupMemberTable members={group.members} group={group} />
		</section>
	);
}
