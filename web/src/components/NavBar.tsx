import { ModeToggle } from './ui/mode-toggle';
import { Gift } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import LogoutButton from './auth/LogoutButton';
import { getSession } from '@/actions/session.actions';

export default async function NavBar() {
	const { isLoggedIn } = await getSession();
	return (
		<header className='flex justify-between items-center mb-16'>
			<Link href='/' className='flex gap-2 items-center'>
				<Gift className='stroke-primary' />
				<span className='font-bold'>Secret Gifter</span>
			</Link>

			<nav className='flex items-center gap-4'>
				<Link href='/'>Home</Link>
				{isLoggedIn && (
					<>
						<Link href='/groups'>Groups</Link>
						<Link href='/invites'>Invites</Link>
					</>
				)}
			</nav>

			<div className='flex items-center gap-4'>
				{!isLoggedIn ? (
					<>
						<Button asChild>
							<Link href='/register'>Register</Link>
						</Button>

						<Button asChild>
							<Link href='/login'>Login</Link>
						</Button>
					</>
				) : (
					<LogoutButton />
				)}
				<ModeToggle />
			</div>
		</header>
	);
}
