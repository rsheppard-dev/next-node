export type User = {
	id: string;
	sessionId: string;
	givenName: string;
	familyName: string;
	dob?: Date;
	email: string;
	picture?: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
	iat: number;
	exp: number;
};
