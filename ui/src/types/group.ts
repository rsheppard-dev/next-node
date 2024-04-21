export type Group = {
	id: string;
	name: string;
	description?: string;
	role: 'member' | 'admin';
	createdAt: string;
	updatedAt: string;
	iat: number;
	exp: number;
};
