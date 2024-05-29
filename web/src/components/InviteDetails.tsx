type Props = {
	invite: Invite;
};

export default function InviteDetails({ invite }: Props) {
	return (
		<div>
			<h1 className='font-bold text-2xl'>Invite to {invite.group.name}</h1>
		</div>
	);
}
