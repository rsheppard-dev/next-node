'use client';

import React from 'react';
import { Button } from '../ui/button';
import { logoutAction } from '@/actions/session.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function Logout() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { execute: logout, status } = useAction(logoutAction, {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['session'],
			});

			router.push('/');
		},
		onError: ({ serverError, fetchError }) => {
			console.error(serverError ?? fetchError);
			router.push('/');
		},
	});

	return (
		<form action={logout}>
			<Button size='sm' disabled={status === 'executing'}>
				Logout
			</Button>
		</form>
	);
}
