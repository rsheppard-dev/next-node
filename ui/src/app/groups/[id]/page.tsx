import GroupProfile from '@/components/GroupProfile';

type Props = {
	params: {
		id: string;
	};
};

export default function groupPage({ params }: Props) {
	return <GroupProfile id={params.id} />;
}
