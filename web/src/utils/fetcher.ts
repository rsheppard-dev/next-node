import { cookies } from 'next/headers';
import { env } from '../../config/env';

type MyRequestInit = Omit<RequestInit, 'body'> & {
	body?: any;
};

export default async function fetcher<T>(
	url: string,
	options?: MyRequestInit
): Promise<T> {
	try {
		if (options?.body && typeof options.body !== 'string') {
			options.body = JSON.stringify(options.body);
		}

		const cookie = cookies().get('auth_session');

		const response = await fetch(env.NEXT_PUBLIC_SERVER_ENDPOINT + url, {
			...options,
			credentials: options?.credentials ?? 'include',
			headers: {
				...options?.headers,
				'Content-Type': 'application/json',
				Cookie: `${cookie?.name}=${cookie?.value}`,
			},
		});

		const data = (await response.json()) as T | ErrorResponse;

		if (!response.ok) {
			const errorData = data as ErrorResponse;
			throw new Error(errorData.message ?? 'Something went wrong.');
		}

		return data as T;
	} catch (error) {
		throw error;
	}
}
