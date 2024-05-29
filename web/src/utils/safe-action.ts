import { createSafeActionClient, DEFAULT_SERVER_ERROR } from 'next-safe-action';

export class ActionError extends Error {}

export const action = createSafeActionClient({
	handleReturnedServerError(e) {
		console.log(e.constructor.name);
		if (e instanceof ActionError || e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR;
	},
});
