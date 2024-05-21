type SessionUser = {
	id: string;
	givenName: string;
	familyName: string;
	email: string;
	picture?: string;
};

type SessionData = {
	id: string;
	user: SessionUser;
	isLoggedIn: boolean;
	accessToken: string;
	tokenExpiry: Date;
};

type SessionResponse = SessionData & {
	refreshToken: string;
	expiresIn: Date;
};
