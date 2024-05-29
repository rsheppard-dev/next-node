import { getGroups } from '@/actions/group.actions';
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import GroupTableRow from './GroupTableRow';

export default async function GroupsTable() {
	const groups = await getGroups();
	return (
		<Table>
			<TableCaption>A list of groups.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>Name</TableHead>
					<TableHead>Description</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{groups?.map(group => (
					<GroupTableRow key={group.id} group={group} />
				))}
			</TableBody>
		</Table>
	);
}
