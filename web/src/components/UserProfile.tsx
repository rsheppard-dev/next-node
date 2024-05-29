type Props = {
	user: User;
};

export default function UserProfile({ user }: Props) {
	return (
		<div>
			<h1 className='text-2xl font-bold'>
				{user.givenName} {user.familyName}&apos;s Profile
			</h1>
		</div>
	);
}
