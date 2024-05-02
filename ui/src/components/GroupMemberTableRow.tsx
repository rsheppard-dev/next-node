import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TableCell, TableRow } from './ui/table';
import { GroupMember } from '@/types/groupMember';
import { Delete, Edit, Info, UserRound } from 'lucide-react';
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

type Props = {
	member: GroupMember;
	groupRole: 'member' | 'admin';
};

export default function GroupMemberTableRow({ member, groupRole }: Props) {
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

				{groupRole === 'admin' ? (
					<>
						<Button asChild variant='ghost' className='px-2 py-1'>
							<Link
								href={`/groups/members/edit?id=${member.id}`}
								title='Edit Role'
							>
								<Edit aria-hidden />
							</Link>
						</Button>

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
									<AlertDialogAction onClick={() => {}}>
										Remove
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				) : null}
			</TableCell>
		</TableRow>
	);
}
