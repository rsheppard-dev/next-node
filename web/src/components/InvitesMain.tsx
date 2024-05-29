import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitesTable from './InvitesTable';

type Props = {
	invites: GetInvitesResponse;
};

export default function InviteMain({ invites }: Props) {
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
