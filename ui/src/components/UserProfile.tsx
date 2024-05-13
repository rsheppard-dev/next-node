'use client';

import { getUser } from '@/actions/user.actions';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

type Props = {
	id: string;
};

export default function UserProfile({ id }: Props) {
	const { data: user, isPending } = useQuery<User>({
		queryKey: ['user', id],
		queryFn: () => getUser(id),
	});

	if (isPending) return <div>Loading user profile...</div>;

	if (!user) return notFound();

	return (
		<div>
			<h1 className='text-2xl font-bold'>
				{user.givenName} {user.familyName}&apos;s Profile
			</h1>
		</div>
	);
}
