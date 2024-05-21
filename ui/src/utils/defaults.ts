export const defaultSession: SessionData = {
	id: '',
	user: {
		id: '',
		givenName: '',
		familyName: '',
		email: '',
		picture: '',
	},
	accessToken: '',
	tokenExpiry: new Date(0),
	isLoggedIn: false,
};
