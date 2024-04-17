import CreateGroupForm from '@/components/CreateGroupForm';

export default function createGroupPage() {
	return (
		<section className='space-y-6'>
			<h1 className='text-xl'>Create New Group</h1>
			<CreateGroupForm />
		</section>
	);
}
