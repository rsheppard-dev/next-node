import GroupsTable from '@/components/GroupsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function groupsPage() {
	return (
		<section className='space-y-6'>
			<div className='flex justify-end'>
				<Link href='/groups/create'>
					<Button variant='outline' className='flex items-center gap-1'>
						<Plus aria-hidden /> Create Group
					</Button>
				</Link>
			</div>
			<GroupsTable />
		</section>
	);
}
