import { getInvites } from '@/actions/invite.actions';
import InviteMain from '@/components/InvitesMain';

export default async function invitesPage() {
	const invites = await getInvites();
	return <InviteMain invites={invites} />;
}
