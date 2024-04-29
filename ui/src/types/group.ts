import { GroupMember } from './groupMember';

export type Group = {
	id: string;
	name: string;
	description?: string;
	role: 'member' | 'admin';
	members: GroupMember[];
	createdAt: string;
	updatedAt: string;
	iat: number;
	exp: number;
};
