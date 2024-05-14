import { getGroup } from '@/actions/group.actions';
import { notFound } from 'next/navigation';
import { Badge } from './ui/badge';
import GroupMemberTable from './GroupMemberTable';
import Link from 'next/link';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import StatusMessage from './StatusMessage';

type Props = {
	id: string;
};

export default async function GroupProfile({ id }: Props) {
	// const [statusMessage, setStatusMessage] = useState<{
	// 	variant: 'destructive' | 'default';
	// 	title: string;
	// 	description: string;
	// } | null>(null);

	const group = await getGroup(id);

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
			{/* {!!statusMessage && (
				<StatusMessage
					variant={statusMessage.variant}
					title={statusMessage.title}
					description={statusMessage.description}
				/>
			)} */}
			<GroupMemberTable
				members={group.members}
				group={group}
				// setStatusMessage={setStatusMessage}
			/>
		</section>
	);
}
