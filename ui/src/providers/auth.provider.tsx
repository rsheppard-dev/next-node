'use client';

import { getCurrentUser } from '@/services/user.services';
import { useSessionStore } from '@/store/session.store';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setIsAuthenticated, setUser } = useSessionStore(state => state);

	const { data: user } = useQuery<User>({
		queryKey: ['user'],
		queryFn: getCurrentUser,
	});

	useEffect(() => {
		async function checkAuthStatus() {
			try {
				if (user) {
					setIsAuthenticated(true);
					setUser(user);
				} else {
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch (error) {
				setIsAuthenticated(false);
				setUser(null);
			}
		}

		checkAuthStatus();
	}, [setIsAuthenticated, setUser, user]);

	return <>{children}</>;
}
