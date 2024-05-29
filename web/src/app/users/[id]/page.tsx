import { getUser } from '@/actions/user.actions';
import UserProfile from '@/components/UserProfile';
import { notFound } from 'next/navigation';

type Props = {
	params: {
		id: string;
	};
};

export default async function userProfilePage({ params }: Props) {
	const user = await getUser(params.id);
	if (!user) return notFound();
	return <UserProfile user={user} />;
}
