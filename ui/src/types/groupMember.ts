import { rolesEnum } from './group';

export type GroupMember = {
	id: string;
	givenName: string;
	familyName: string;
	email: string;
	picture: string;
	role: rolesEnum;
};
