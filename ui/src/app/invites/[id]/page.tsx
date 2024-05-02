import InviteDetails from '@/components/InviteDetails';

type Props = {
	params: {
		id: string;
	};
};

export default function invitePage({ params }: Props) {
	return <InviteDetails id={params.id} />;
}
