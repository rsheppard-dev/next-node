type SessionData = {
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

type SessionResponse = SessionData & {
	refreshToken: string;
	expiresIn: Date;
};
