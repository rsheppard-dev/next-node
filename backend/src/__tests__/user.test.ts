import supertest from 'supertest';
import createServer from '../utils/server';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../services/user.services';

const app = createServer();

const userId = uuidv4();

export const userPayload = {
	id: userId,
	givenName: 'Roy',
	familyName: 'Sheppard',
	email: 'rheppard83@gmail.com',
	password: '12345678',
	isVerified: true,
};

describe('user', () => {
	describe('get user route', () => {
		describe('given the user does not exist', () => {
			it('should return a 404', async () => {
				const userId = 'bcdadf12-2ac7-4488-b0ec-ee6adfed5b65';

				await supertest(app).get(`/api/users/${userId}`).expect(404);
			});
		});

		describe('given the user exists', () => {
			it('should return the user', async () => {
				const user = await createUser(userPayload);

				const { body, statusCode } = await supertest(app).get(
					`/api/users/${user.id}`
				);

				expect(statusCode).toBe(200);
				expect(body.id).toEqual(user.id);
			});
		});
	});
});
