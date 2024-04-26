import { User } from './user';

export type Group = {
	id: string;
	name: string;
	description?: string;
	role: 'member' | 'admin';
	members: User[];
	createdAt: string;
	updatedAt: string;
	iat: number;
	exp: number;
};
