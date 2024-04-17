import LoginForm from '@/components/LoginForm';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function loginPage() {
	return (
		<section className='space-y-6'>
			<LoginForm />
			<Separator />
			<div className='space-y-2'>
				<p className='text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/register' className='text-primary'>
						Register
					</Link>
				</p>
				<p className='text-sm'>
					Forgot your password?{' '}
					<Link href='/forgot-password' className='text-primary'>
						Reset password
					</Link>
				</p>
			</div>
		</section>
	);
}
