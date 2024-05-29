'use server';

import {
	ChangeUserRoleInput,
	CreateGroupInput,
	createGroupInputSchema,
	UpdateGroupInput,
} from '@/schemas/group.schemas';
import { Group } from '@/types/group';
import { revalidatePath } from 'next/cache';
import fetcher from '@/utils/fetcher';
import { action } from '@/utils/safe-action';

export const createGroupAction = action(createGroupInputSchema, createGroup);

async function createGroup(values: CreateGroupInput) {
	try {
		const groups = await fetcher<Group>('/api/groups', {
			method: 'POST',
			body: values,
		});

		revalidatePath('/groups');

		return groups;
	} catch (error) {
		return error;
	}
}

export async function getGroups() {
	try {
		const groups = await fetcher<Group[]>('/api/groups', {
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
		const group = await fetcher<Group>(`/api/groups/${id}`);

		revalidatePath('/groups/' + id);

		return group;
	} catch (error) {
		console.log('Failed to get group', error);
		return null;
	}
}

export async function updateGroup(values: UpdateGroupInput) {
	try {
		const group = await fetcher<Group>('/api/groups', {
			method: 'PATCH',
			body: values,
		});

		revalidatePath('/groups');

		return group;
	} catch (error) {
		console.log('Failed to update group', error);
		throw error;
	}
}

export async function deleteGroup(id: string) {
	try {
		await fetcher<Group>(`/api/groups/${id}`, {
			method: 'DELETE',
		});

		revalidatePath('/groups');
	} catch (error) {
		throw error;
	}
}

export async function updateGroupRole(values: ChangeUserRoleInput) {
	try {
		const group = await fetcher<Group>('/api/groups/role', {
			method: 'PATCH',
			body: values,
		});

		revalidatePath('/groups');

		return group;
	} catch (error) {
		console.log('Failed to update group role', error);
		throw error;
	}
}

export async function removeUserFromGroup(groupId: string, userId: string) {
	try {
		const data = await fetcher(`/api/groups/${groupId}/${userId}`, {
			method: 'DELETE',
		});

		revalidatePath(`/groups/${groupId}`);

		return data;
	} catch (error) {
		console.log('Failed to remove user from group', error);
		throw error;
	}
}
