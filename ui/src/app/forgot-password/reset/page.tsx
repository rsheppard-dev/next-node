import ResetPasswordForm from '@/components/ResetPasswordForm';
import { Suspense } from 'react';

export default function resetPasswordPage() {
	return (
		<section>
			<Suspense>
				<ResetPasswordForm />
			</Suspense>
		</section>
	);
}
