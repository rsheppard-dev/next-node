'use client';

import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import getGoogleOAuthUrl from '@/utils/getGoogleUrl';
import { useSessionStore } from '@/stores/session.store';
import { getCurrentUser } from '@/services/user.services';

export default function WelcomeSection() {
	const router = useRouter();

	const { logout, isAuthenticated } = useSessionStore();

	const {
		data: user,
		isPending,
		isError,
		error,
	} = useQuery<User>({
		queryKey: ['currentUser'],
		queryFn: getCurrentUser,
		enabled: isAuthenticated,
	});

	if (isPending) return <p>Loading...</p>;
	if (isError) return <p>Error loading user data. {error.message}</p>;

	function handleLogin() {
		router.push('/login');
	}

	function handleGoogleLogin() {
		router.push(getGoogleOAuthUrl());
	}

	async function handleLogout() {
		await logout();
	}

	if (isAuthenticated && user)
		return (
			<section className='flex flex-col gap-8'>
				<h1 className='text-4xl font-bold'>Welcome back {user?.givenName}!</h1>
				<p className='text-xl text-muted-foreground'>You are now logged in.</p>
				<div className='flex items-center gap-6'>
					<Link href='/users'>
						<Button variant={'secondary'}>View Profile</Button>
					</Link>
					<Button onClick={handleLogout}>Logout</Button>
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
				<Button variant={'secondary'} onClick={handleGoogleLogin}>
					Login With Google
				</Button>
				<Button onClick={handleLogin}>Login</Button>
			</div>
		</section>
	);
}
