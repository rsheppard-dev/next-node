import { Invite } from '@/types/invite';
import React from 'react';
import { TableCell, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Info } from 'lucide-react';

type Props = {
	invite: Invite;
};

export default function InvitesTableRow({ invite }: Props) {
	return (
		<TableRow>
			<TableCell
				className={`${invite.status === 'sent' ? 'font-bold' : 'font-normal'}`}
			>
				{invite.group.name}
			</TableCell>
			<TableCell>
				<Button
					asChild
					variant='link'
					className={`${
						invite.status === 'sent' ? 'font-bold' : 'font-normal'
					} p-0`}
				>
					<a href={`mailto:${invite.email}`}>{invite.email}</a>
				</Button>
			</TableCell>
			<TableCell>
				<Badge variant='outline'>{invite.status}</Badge>
			</TableCell>
			<TableCell className='flex justify-end items-center'>
				<Button asChild variant='ghost' className='px-2 py-1'>
					<Link href={`/invites/${invite.id}`} title='Invite Details'>
						<Info aria-hidden />
					</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}
