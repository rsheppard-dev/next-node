'use client';

import { useState } from 'react';
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from '@/utils/axios';
import { useSessionStore } from '@/stores/session.store';
import { useRouter } from 'next/navigation';

export default function TanstackProvider({
	refreshToken,
	children,
}: {
	refreshToken?: string;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);

	async function refreshAccessToken() {
		setIsRefreshing(true);

		if (refreshToken && !isRefreshing) {
			try {
				const response = await axios.get<{ accessToken: string }>(
					'api/sessions/refresh'
				);

				useSessionStore.getState().setAccessToken(response.data.accessToken);

				queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			} catch (error) {
				console.log('Error refreshing access token', error);
				router.push('/login');
			} finally {
				setIsRefreshing(false);
			}
		}
	}

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: (failureCount, error: any) => {
					if (
						error?.response?.status === 401 ||
						error?.response?.status === 403
					) {
						return false;
					}

					return failureCount < 2;
				},
			},
		},
		queryCache: new QueryCache({
			onError: (error: any) => {
				if (
					error?.response?.status === 401 ||
					error?.response?.status === 403
				) {
					console.log('Refreshing access token');
					refreshAccessToken();
				}
			},
		}),
	});

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
