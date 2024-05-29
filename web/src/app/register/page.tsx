import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';
import CreateUserForm from '@/components/CreateUserForm';

export default function registerPage() {
	return (
		<section className='space-y-6'>
			<CreateUserForm />
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
