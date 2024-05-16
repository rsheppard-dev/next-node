'use server';

import {
	ChangeUserRoleInput,
	createGroupInputSchema,
	deleteGroupSchema,
	UpdateGroupInput,
} from '@/schemas/group.schemas';
import { Group } from '@/types/group';
import axios from '@/utils/axios';
import { env } from '../../config/env';
import { getSession } from './session.actions';
import { authAction } from '@/utils/safe-action';
import { revalidatePath } from 'next/cache';
import fetcher from '@/utils/fetcher';

export const createGroupAction = authAction(
	createGroupInputSchema,
	async (values, session) => {
		try {
			const groups = await fetcher<Group>('/api/groups', {
				method: 'POST',
				body: values,
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			});

			revalidatePath('/groups');

			return groups;
		} catch (error) {
			throw error;
		}
	}
);

export async function getGroups() {
	try {
		const session = await getSession();

		const groups = await fetcher<Group[]>('/api/groups', {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
			next: {
				tags: ['groups'],
			},
		});

		revalidatePath('/groups');

		return groups;
	} catch (error) {
		console.log('Failed to get groups', error);
		throw error;
	}
}

export async function getGroup(id: string) {
	try {
		const session = await getSession();

		const response = await fetch(
			`${env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/groups/${id}`,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		revalidatePath('/groups/' + id);

		return (await response.json()) as Group;
	} catch (error) {
		console.log('Failed to get group', error);
		throw error;
	}
}

export async function updateGroup(values: UpdateGroupInput) {
	try {
		const response = await axios.patch<Group>('/api/groups', values);

		revalidatePath('/groups');

		return response.data;
	} catch (error) {
		console.log('Failed to update group', error);
		throw error;
	}
}

export const deleteGroupAction = authAction(
	deleteGroupSchema,
	async ({ id }, { accessToken }) => {
		try {
			const group = await fetcher<Group>(`/api/groups/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			revalidatePath('/groups');

			return group;
		} catch (error) {
			throw error;
		}
	}
);

export async function updateGroupRole(values: ChangeUserRoleInput) {
	try {
		const response = await axios.patch<Group>('/api/groups/role', values);

		revalidatePath('/groups');

		return response.data;
	} catch (error) {
		console.log('Failed to update group role', error);
		throw error;
	}
}

export async function removeUserFromGroup(groupId: string, userId: string) {
	try {
		const response = await axios.delete(`/api/groups/${groupId}/${userId}`);

		revalidatePath(`/groups/${groupId}`);

		return response.data;
	} catch (error) {
		console.log('Failed to remove user from group', error);
		throw error;
	}
}
