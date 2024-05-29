import { id as userId } from './user.mocks';

export const id = '17d8fcf5-9a74-4ed5-a608-296889e2c046';

export const sessionPayload = {
	id,
	userId,
	userAgent: 'PostmanRuntime/7.28.4',
	isValid: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const sessionBody = {
	email: 'me@test.com',
	password: 'password123',
};
