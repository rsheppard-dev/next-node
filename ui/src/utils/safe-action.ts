import { getSession } from '@/actions/session.actions';
import { AxiosError } from 'axios';
import { createSafeActionClient, DEFAULT_SERVER_ERROR } from 'next-safe-action';

export const action = createSafeActionClient({
	handleReturnedServerError(e) {
		if (e instanceof AxiosError) {
			return e.response?.data?.message ?? e.message;
		}

		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR;
	},
});

export const authAction = createSafeActionClient({
	async middleware() {
		const session = await getSession();

		if (!session.isLoggedIn)
			throw new Error('You must be logged in to perform this action.');

		return session;
	},
	handleReturnedServerError(e) {
		if (e instanceof AxiosError) {
			return e.response?.data?.message ?? e.message;
		}

		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR;
	},
});
