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

type Props = {
	members: GroupMember[];
	groupRole: 'member' | 'admin';
};

export default function GroupMemberTable({ members, groupRole }: Props) {
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
					<GroupMemberTableRow
						key={member.id}
						member={member}
						groupRole={groupRole}
					/>
				))}
			</TableBody>
		</Table>
	);
}
