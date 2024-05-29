import { getGroup } from '@/actions/group.actions';
import GroupProfile from '@/components/GroupProfile';
import { notFound } from 'next/navigation';

type Props = {
	params: {
		id: string;
	};
};

export default async function groupPage({ params }: Props) {
	const group = await getGroup(params.id);
	if (!group) return notFound();

	return <GroupProfile group={group} />;
}
