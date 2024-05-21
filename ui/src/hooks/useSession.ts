'use client';

import { getSession, login, logout } from '@/actions/session.actions';
import { useSessionSelectors } from '@/stores/session.store';
import { defaultSession } from '@/utils/defaults';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

export default function useSession() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { createSession, deleteSession, user, isLoggedIn } =
		useSessionSelectors();

	const sessionQuery = useQuery({
		queryFn: () => getSession(),
		queryKey: ['session'],
		initialData: defaultSession,
	});

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: session => {
			createSession(session.user);
			queryClient.setQueryData(['session'], session);
			const destination = searchParams.get('from') ?? '/';
			router.push(destination);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			deleteSession();
			queryClient.setQueryData(['session'], defaultSession);
			router.push('/');
		},
	});

	return { loginMutation, logoutMutation, sessionQuery, user, isLoggedIn };
}
