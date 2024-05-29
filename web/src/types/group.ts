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

export type GroupMember = {
	id: string;
	givenName: string;
	familyName: string;
	email: string;
	picture: string;
	role: rolesEnum;
};

export enum rolesEnum {
	admin = 'admin',
	member = 'member',
}
