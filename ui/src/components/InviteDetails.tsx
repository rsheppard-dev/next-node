'use client';

import { getInvite } from '@/actions/invite.actions';
import { Invite } from '@/types/invite';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

type Props = {
	id: string;
};

export default function InviteDetails({ id }: Props) {
	const { data: invite, isPending } = useQuery<Invite>({
		queryKey: ['invite', id],
		queryFn: () => getInvite(id as string),
	});

	if (isPending) return <div>Loading invite details...</div>;

	if (!invite) return notFound();

	return (
		<div>
			<h1 className='font-bold text-2xl'>Invite to {invite.group.name}</h1>
		</div>
	);
}
