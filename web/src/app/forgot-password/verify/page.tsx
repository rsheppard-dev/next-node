import VerifyResetPasswordForm from '@/components/VerifyResetPasswordForm';
import { Suspense } from 'react';

export default function verifyResetPasswordPage() {
	return (
		<section>
			<Suspense>
				<VerifyResetPasswordForm />
			</Suspense>
		</section>
	);
}
