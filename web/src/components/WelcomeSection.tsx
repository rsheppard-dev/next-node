import { getSession } from '@/actions/session.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LogoutButton from './auth/LogoutButton';

export default async function WelcomeSection() {
	const { isLoggedIn, user } = await getSession();

	if (isLoggedIn)
		return (
			<section className='flex flex-col gap-8'>
				<h1 className='text-4xl font-bold'>Welcome back {user?.givenName}!</h1>
				<p className='text-xl text-muted-foreground'>You are now logged in.</p>
				<div className='flex items-center gap-6'>
					<Link href={`/users/${user?.id}`}>
						<Button variant={'secondary'}>View Profile</Button>
					</Link>
					<LogoutButton />
				</div>
			</section>
		);

	return (
		<section className='flex flex-col gap-8'>
			<h1 className='text-4xl font-bold'>Secret Gifter</h1>
			<p className='text-xl text-muted-foreground'>
				The ultimate way to organise secret gifting.
			</p>
			<div className='flex items-center gap-6'>
				<Button asChild>
					<Link href='/login'>Login</Link>
				</Button>
			</div>
		</section>
	);
}
