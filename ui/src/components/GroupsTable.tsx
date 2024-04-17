'use client';

import { getGroups } from '@/services/group.services';
import { Group } from '@/types/group';
import { useQuery } from '@tanstack/react-query';
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import GroupTableRow from './GroupTableRow';
import { useSessionStore } from '@/stores/session.store';

export default function GroupsTable() {
	const { user } = useSessionStore();

	const {
		data: groups,
		isPending,
		isError,
		error,
	} = useQuery<Group[]>({
		queryKey: ['groups'],
		queryFn: getGroups,
	});

	if (isPending) return <p>Loading...</p>;
	if (isError) return <p>Error loading groups. {error.message}</p>;

	return (
		<Table>
			<TableCaption>A list of {user?.givenName}&apos;s groups.</TableCaption>
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
