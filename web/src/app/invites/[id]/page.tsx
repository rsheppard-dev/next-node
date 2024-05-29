import { getInvite } from '@/actions/invite.actions';
import InviteDetails from '@/components/InviteDetails';
import { notFound } from 'next/navigation';

type Props = {
	params: {
		id: string;
	};
};

export default async function invitePage({ params }: Props) {
	const invite = await getInvite(params.id);
	if (!invite) return notFound();
	return <InviteDetails invite={invite} />;
}
