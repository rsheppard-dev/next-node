import EditGroupForm from '@/components/EditGroupForm';
import { Suspense } from 'react';

export default function editGroupPage() {
	return (
		<section className='space-y-6'>
			<h1 className='text-xl'>Edit Group</h1>
			<Suspense>
				<EditGroupForm />
			</Suspense>
		</section>
	);
}
