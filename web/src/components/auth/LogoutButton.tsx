'use client';

import { logout } from '@/actions/session.actions';
import { Button } from '../ui/button';

export default function LogoutButton() {
	return (
		<form action={logout}>
			<Button>Logout</Button>
		</form>
	);
}
