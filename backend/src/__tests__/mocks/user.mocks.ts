export const id = '59a5d4ec-8544-4664-8f17-b099763fbc22';

export const userBody = {
	givenName: 'Test',
	familyName: 'User',
	email: 'me@test.com',
	password: 'password123',
	confirmPassword: 'password123',
};

export const newUserPayload = {
	id,
	givenName: 'Test',
	familyName: 'User',
	email: 'me@test.com',
	isVerified: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const userPayload = {
	id,
	givenName: 'Test',
	familyName: 'User',
	email: 'me@test.com',
	password: 'password123',
	isVerified: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const userConflictErrorPayload = {
	code: '23505',
	message: 'User with that email already exists',
	statusCode: 409,
};
