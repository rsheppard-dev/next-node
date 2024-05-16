import { CreateInviteResponse } from '@/types/invite';
import { CircleCheck, CircleX } from 'lucide-react';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

type Props = {
	data: CreateInviteResponse;
};
export default function CreateInvitesResponse({ data }: Props) {
	return (
		<Table>
			<TableBody>
				{data.issues.map(issue => (
					<TableRow key={issue.email}>
						<TableCell className='font-bold'>{issue.email}</TableCell>
						<TableCell>
							<CircleX
								className='w-6 h-6 stroke-red-600'
								aria-label='Failed to invite'
							/>
						</TableCell>
						<TableCell>{issue.issue}</TableCell>
					</TableRow>
				))}
				{data.invites.map(invite => (
					<TableRow key={invite.id}>
						<TableCell className='font-bold'>{invite.email}</TableCell>
						<TableCell>
							<CircleCheck
								className='w-6 h-6 stroke-green-600'
								aria-label='Invite successful'
							/>
						</TableCell>
						<TableCell>Invite successfully sent</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
