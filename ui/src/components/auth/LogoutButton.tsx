'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';

export default function Logout() {
	const router = useRouter();
	const {
		logoutMutation: { mutate: logout, isPending },
	} = useSession();

	return (
		<form action={() => logout()}>
			<Button size='sm' disabled={isPending}>
				Logout
			</Button>
		</form>
	);
}
