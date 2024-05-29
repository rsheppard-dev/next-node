import CreateInvitesForm from '@/components/CreateInvitesForm';
import { Suspense } from 'react';

export default function createInvitesPage() {
	return (
		<Suspense>
			<CreateInvitesForm />
		</Suspense>
	);
}
