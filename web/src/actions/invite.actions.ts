import {
	CreateInvitesInput,
	createInvitesInputSchema,
} from '@/schemas/invite.schemas';
import fetcher from '@/utils/fetcher';
import { action } from '@/utils/safe-action';

export const createInvitesAction = action(
	createInvitesInputSchema,
	createInvites
);

async function createInvites(values: CreateInvitesInput) {
	try {
		const response = await fetcher<CreateInviteResponse>('/api/invites', {
			method: 'POST',
			body: values,
		});

		return response;
	} catch (error) {
		console.log('Failed to create invites', error);
		throw error;
	}
}

export async function getInvites() {
	try {
		const response = await fetcher<GetInvitesResponse>('/api/invites');

		return response;
	} catch (error) {
		throw error;
	}
}

export async function getInvite(id: string) {
	try {
		const response = await fetcher<Invite>(`/api/invites/${id}`);

		return response;
	} catch (error) {
		return null;
	}
}
