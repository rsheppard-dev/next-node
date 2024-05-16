'use client';

import { defaultSession } from '@/utils/defaults';
import { useQuery } from '@tanstack/react-query';

export default function useSession() {
	const {
		isPending,
		data: session,
		error,
	} = useQuery<SessionData>({
		queryKey: ['session'],
		queryFn: () => fetch('/api/session').then(res => res.json()),
		initialData: defaultSession,
	});

	return {
		isPending,
		session,
		error,
	};
}
