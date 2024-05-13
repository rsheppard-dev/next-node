import { CreateInvitesInput } from '@/schemas/invite.schemas';
import { CreateInviteResponse, GetInvitesResponse } from '@/types/invite';
import axios from '@/utils/axios';
import { getSession } from './session.actions';

export async function createInvites(values: CreateInvitesInput) {
	try {
		const response = await axios.post<CreateInviteResponse>(
			'/api/invites',
			values
		);

		return response.data;
	} catch (error) {
		console.log('Failed to create invites', error);
		throw error;
	}
}

export async function getInvites() {
	try {
		const session = await getSession();

		const response = await axios.get<GetInvitesResponse>('/api/invites', {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getInvite(id: string) {
	try {
		const response = await axios.get(`/api/invites/${id}`);

		return response.data;
	} catch (error) {
		throw error;
	}
}
