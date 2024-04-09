'use client';

import { User } from '@/types/user';
import fetcher from '@/utils/fetcher';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useSessionSelectors } from '@/stores/session.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomeSection() {
	const router = useRouter();
	const isAuthenticated = useSessionSelectors.use.isAuthenticated();
	const logout = useSessionSelectors.use.logout();

	const {
		data: user,
		isPending,
		isError,
		error,
	} = useQuery<User>({
		queryKey: ['currentUser'],
		queryFn: () => fetcher<User>('/api/users/me'),
		enabled: isAuthenticated,
	});

	if (isPending && isAuthenticated) return <p>Loading...</p>;
	if (isError) return <p>Error loading user data. {error.message}</p>;

	function handleLogin() {
		router.push('/login');
	}

	async function handleLogout() {
		await logout();
		router.push('/');
	}

	if (isAuthenticated && user)
		return (
			<section className='flex flex-col gap-8'>
				<h1 className='text-4xl font-bold'>Welcome back {user?.givenName}!</h1>
				<p className='text-xl text-muted-foreground'>You are now logged in.</p>
				<div className='flex items-center gap-6'>
					<Link href='/user'>
						<Button variant={'secondary'}>View Profile</Button>
					</Link>
					<Button onClick={handleLogout}>Logout</Button>
				</div>
			</section>
		);

	return (
		<section className='flex flex-col gap-8'>
			<h1 className='text-4xl font-bold'>ShadCn Practice</h1>
			<p className='text-xl text-muted-foreground'>I am learning ShadCn!</p>
			<div className='flex items-center gap-6'>
				<Button variant={'secondary'}>Learn More</Button>
				<Button onClick={handleLogin}>Login</Button>
			</div>
		</section>
	);
}
