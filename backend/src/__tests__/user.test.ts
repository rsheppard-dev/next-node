import supertest from 'supertest';
import createServer from '../utils/server';
import * as UserService from '../services/user.services';
import {
	newUserPayload,
	userConflictErrorPayload,
	userBody,
} from './mocks/user.mocks';
import { nanoid } from 'nanoid';

const app = createServer();

jest.mock('nanoid', () => ({
	nanoid: jest.fn(() => '4rcHM8Ch_g'),
}));

describe('user', () => {
	// user registration
	describe('user registration', () => {
		describe('given the user provides a valid email and password', () => {
			it('should return the user payload', async () => {
				const createUserServiceMock = jest
					.spyOn(UserService, 'createUser')
					// @ts-ignore
					.mockReturnValueOnce(newUserPayload);

				const { status, body } = await supertest(app)
					.post('/api/users')
					.send(userBody);

				expect(status).toBe(201);
				expect(body).toEqual(newUserPayload);
				expect(createUserServiceMock).toHaveBeenCalledWith(userBody);
			});
		});

		describe('given the passwords do not match', () => {
			it('should return a 400 error', async () => {
				const createUserServiceMock = jest
					.spyOn(UserService, 'createUser')
					// @ts-ignore
					.mockReturnValueOnce(newUserPayload);

				const { status, body } = await supertest(app)
					.post('/api/users')
					.send({ ...userBody, confirmPassword: 'password1234' });

				expect(status).toBe(400);
				expect(createUserServiceMock).not.toHaveBeenCalled();
			});
		});

		describe('given the user email already exists', () => {
			it('should return a 409 error', async () => {
				const createUserServiceMock = jest
					.spyOn(UserService, 'createUser')
					// @ts-ignore
					.mockRejectedValue(userConflictErrorPayload);

				const { status, body } = await supertest(app)
					.post('/api/users')
					.send(userBody);

				expect(status).toBe(409);
				expect(body).toEqual(userConflictErrorPayload);
				expect(createUserServiceMock).toHaveBeenCalledWith(userBody);
			});
		});
	});
});
