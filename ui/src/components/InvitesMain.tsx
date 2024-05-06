'use client';

import { getInvites } from '@/services/invite.services';
import { GetInvitesResponse } from '@/types/invite';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitesTable from './InvitesTable';

export default function InviteMain() {
	const {
		data: invites,
		isPending,
		error,
	} = useQuery<GetInvitesResponse>({
		queryKey: ['invites'],
		queryFn: getInvites,
	});

	if (isPending) return <div>Loading invites...</div>;

	if (error) return <div>Error loading invites: {error.message}</div>;

	return (
		<Tabs defaultValue='sent'>
			<TabsList>
				<TabsTrigger value='sent'>Sent</TabsTrigger>
				<TabsTrigger value='received'>Received</TabsTrigger>
			</TabsList>
			<TabsContent value='sent'>
				<InvitesTable invites={invites.invitesSent} tab='sent' />
			</TabsContent>
			<TabsContent value='received'>
				<InvitesTable invites={invites.invitesReceived} tab='received' />
			</TabsContent>
		</Tabs>
	);
}
