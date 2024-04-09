import RegistrationForm from '@/components/RegistrationForm';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';

export default function registerPage() {
	return (
		<section className='space-y-6'>
			<RegistrationForm />
			<Separator />
			<div>
				<p className='text-sm'>
					Already have an account?{' '}
					<Link href='/login' className='text-primary'>
						Login
					</Link>
				</p>
			</div>
		</section>
	);
}
