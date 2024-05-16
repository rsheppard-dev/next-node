import { getSession } from '@/actions/session.actions';
import { createSafeActionClient, DEFAULT_SERVER_ERROR } from 'next-safe-action';

export const action = createSafeActionClient({
	handleReturnedServerError(e) {
		return e.message ?? DEFAULT_SERVER_ERROR;
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
		return e?.message ?? DEFAULT_SERVER_ERROR;
	},
});
