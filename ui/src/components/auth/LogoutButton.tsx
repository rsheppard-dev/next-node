import React from 'react';
import { Button } from '../ui/button';
import { logout } from '@/actions/session.actions';
import { redirect } from 'next/navigation';

export default function Logout() {
	async function handleLogout() {
		'use server';
		await logout();
		redirect('/');
	}
	return (
		<form action={handleLogout}>
			<Button size='sm'>Logout</Button>
		</form>
	);
}
