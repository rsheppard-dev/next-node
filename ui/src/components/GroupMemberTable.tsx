import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import GroupMemberTableRow from './GroupMemberTableRow';
import { GroupMember } from '@/types/groupMember';
import { Group } from '@/types/group';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	members: GroupMember[];
	group: Group;
};

export default function GroupMemberTable({ members, group }: Props) {
	return (
		<Table>
			<TableCaption>Group members.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{members?.map(member => (
					<GroupMemberTableRow key={member.id} member={member} group={group} />
				))}
			</TableBody>
		</Table>
	);
}
