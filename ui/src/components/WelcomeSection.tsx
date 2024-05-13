import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logout from './auth/LogoutButton';
import { SessionData } from '@/types/session';

type Props = {
	session: SessionData;
};

export default function WelcomeSection({ session }: Props) {
	if (session.isLoggedIn)
		return (
			<section className='flex flex-col gap-8'>
				<h1 className='text-4xl font-bold'>
					Welcome back {session.givenName}!
				</h1>
				<p className='text-xl text-muted-foreground'>You are now logged in.</p>
				<div className='flex items-center gap-6'>
					<Link href={`/users/${session.userId}`}>
						<Button variant={'secondary'}>View Profile</Button>
					</Link>
					<Logout />
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
