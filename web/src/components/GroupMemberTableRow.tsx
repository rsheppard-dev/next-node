import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TableCell, TableRow } from './ui/table';
import { Delete, Info, UserRound } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import ChangeRoleDialog from './ChangeRoleDialog';
import { Group, GroupMember } from '@/types/group';
import { removeUserFromGroup } from '@/actions/group.actions';

type Props = {
	member: GroupMember;
	group: Group;
};

export default function GroupMemberTableRow({ member, group }: Props) {
	async function handleRemoveMember() {
		try {
			const response = await removeUserFromGroup(group.id, member.id);

			// 	setStatusMessage({
			// 		variant: 'default',
			// 		title: 'Success',
			// 		description: `${member.givenName} ${member.familyName} has been removed from the group.`,
			// 	});
		} catch (error: any) {
			// setStatusMessage({
			// 	variant: 'destructive',
			// 	title: 'Error',
			// 	description: error?.response?.data?.message ?? 'Something went wrong.',
			// });
		}
	}

	return (
		<TableRow>
			<TableCell className='flex items-center gap-2'>
				<Avatar>
					<AvatarImage src={member?.picture} />
					<AvatarFallback>
						<UserRound />
					</AvatarFallback>
				</Avatar>
				<span>{`${member.givenName} ${member.familyName}`}</span>
			</TableCell>
			<TableCell>
				<Button asChild variant='link' className='p-0'>
					<a href={`mailto:${member.email}`}>{member.email}</a>
				</Button>
			</TableCell>
			<TableCell>
				<Badge variant='outline'>{member.role}</Badge>
			</TableCell>
			<TableCell className='flex justify-end items-center'>
				<Button asChild variant='ghost' className='px-2 py-1'>
					<Link href={`/users/${member.id}`} title='User Profile'>
						<Info aria-hidden />
					</Link>
				</Button>

				{group.role === 'admin' ? (
					<>
						<ChangeRoleDialog user={member} group={group} />

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='ghost'
									title='Remove Member'
									className='px-2 py-1'
								>
									<Delete aria-hidden />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action will remove the {member.givenName}{' '}
										{member.familyName} from the group.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>Remove</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				) : null}
			</TableCell>
		</TableRow>
	);
}
