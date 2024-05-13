import { ModeToggle } from './ui/mode-toggle';
import { Gift } from 'lucide-react';
import Link from 'next/link';
import Logout from './auth/LogoutButton';
import { getSession } from '@/actions/session.actions';
import { Button } from './ui/button';

export default async function NavBar() {
	const session = await getSession();

	return (
		<header className='flex justify-between items-center mb-16'>
			<Link href='/' className='flex gap-2 items-center'>
				<Gift className='stroke-primary' />
				<span className='font-bold'>Secret Gifter</span>
			</Link>

			<nav className='flex items-center gap-4'>
				<Link href='/'>Home</Link>
				{session.isLoggedIn && (
					<>
						<Link href='/groups'>Groups</Link>
						<Link href='/invites'>Invites</Link>
					</>
				)}
			</nav>

			<div className='flex items-center gap-4'>
				{session.isLoggedIn ? (
					<Logout />
				) : (
					<Button asChild size='sm'>
						<Link href='/login'>Login</Link>
					</Button>
				)}
				<ModeToggle />
			</div>
		</header>
	);
}
