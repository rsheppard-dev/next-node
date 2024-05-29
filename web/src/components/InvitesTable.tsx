import React from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import InvitesTableRow from './InvitesTableRow';

type Props = {
	invites: Invite[];
	tab: 'sent' | 'received';
};

export default function InvitesTable({ invites, tab }: Props) {
	return (
		<Table>
			<TableCaption>
				{tab === 'sent' ? 'Sent invites' : 'Received invites'}
			</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Group</TableHead>
					<TableHead>{tab === 'sent' ? 'Email' : 'From'}</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invites?.map(invite => (
					<InvitesTableRow key={invite.id} invite={invite} />
				))}
			</TableBody>
		</Table>
	);
}
