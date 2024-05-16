import VerifyUserForm from '@/components/VerifyUserForm';
import { Suspense } from 'react';

export default function verifyUserPage() {
	return (
		<section>
			<Suspense>
				<VerifyUserForm />
			</Suspense>
		</section>
	);
}
