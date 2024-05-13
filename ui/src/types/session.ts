export type SessionData = {
	id: string;
	userId: string;
	givenName: string;
	familyName: string;
	email: string;
	picture?: string;
	isLoggedIn: boolean;
	accessToken: string;
	tokenExpiry: Date;
};

export type SessionResponse = {
	id: string;
	userId: string;
	userAgent?: string;
	token: string;
	expiresIn: Date;
	createdAt: Date;
	updatedAt: Date;
};
