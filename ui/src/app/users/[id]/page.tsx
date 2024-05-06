import UserProfile from '@/components/UserProfile';

type Props = {
	params: {
		id: string;
	};
};

export default async function userProfilePage({ params }: Props) {
	return <UserProfile id={params.id} />;
}
