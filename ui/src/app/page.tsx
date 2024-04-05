'use client';

import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { env } from '../../config/env';
import fetcher from '@/utils/fetcher';
import { User } from '@/types/user';

export default function Home() {
	const { data, isLoading } = useSWR<User>(() => '/api/users/me', fetcher);

	if (isLoading) return <p>Loading...</p>;

	if (data)
		return (
			<section className='flex flex-col gap-8'>
				<h1 className='text-4xl font-bold'>Welcome back, {data.givenName}!</h1>
				<p className='text-xl text-muted-foreground'>You are now logged in.</p>
				<div className='flex items-center gap-6'>
					<Button variant={'secondary'}>View Profile</Button>
					<Button>Logout</Button>
				</div>
			</section>
		);

	return (
		<section className='flex flex-col gap-8'>
			<h1 className='text-4xl font-bold'>ShadCn Practice</h1>
			<p className='text-xl text-muted-foreground'>I am learning ShadCn!</p>
			<div className='flex items-center gap-6'>
				<Button variant={'secondary'}>Learn More</Button>
				<Button>Enroll Now</Button>
			</div>
		</section>
	);
}
