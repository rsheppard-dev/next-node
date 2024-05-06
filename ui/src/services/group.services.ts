import {
	ChangeUserRoleInput,
	CreateGroupInput,
	UpdateGroupInput,
} from '@/schemas/group.schemas';
import { Group } from '@/types/group';
import axios from '@/utils/axios';

export async function createGroup(values: CreateGroupInput) {
	try {
		const response = await axios.post<Group>('/api/groups', values);

		return response.data;
	} catch (error) {
		console.log('Failed to create group', error);
		throw error;
	}
}

export async function getGroups() {
	try {
		const response = await axios.get<Group[]>('/api/groups');

		return response.data;
	} catch (error) {
		console.log('Failed to get groups', error);
		throw error;
	}
}

export async function getGroup(id: string) {
	try {
		const response = await axios.get<Group>(`/api/groups/${id}`);

		return response.data;
	} catch (error) {
		console.log('Failed to get group', error);
		throw error;
	}
}

export async function updateGroup(values: UpdateGroupInput) {
	try {
		const response = await axios.patch<Group>('/api/groups', values);

		return response.data;
	} catch (error) {
		console.log('Failed to update group', error);
		throw error;
	}
}

export async function deleteGroup(id: string) {
	try {
		const response = await axios.delete('/api/groups', { data: { id } });

		return response.data;
	} catch (error) {
		console.log('Failed to delete group', error);
		throw error;
	}
}

export async function updateGroupRole(values: ChangeUserRoleInput) {
	try {
		const response = await axios.patch<Group>('/api/groups/role', values);

		return response.data;
	} catch (error) {
		console.log('Failed to update group role', error);
		throw error;
	}
}

export async function removeUserFromGroup(groupId: string, userId: string) {
	try {
		const response = await axios.delete(`/api/groups/${groupId}/${userId}`);

		return response.data;
	} catch (error) {
		console.log('Failed to remove user from group', error);
		throw error;
	}
}
