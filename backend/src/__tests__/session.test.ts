import createServer from '../utils/server';
import * as SessionService from '../services/session.services';
import * as UserService from '../services/user.services';
import {
	sessionPayload,
	sessionBody,
	id as sessionId,
} from './mocks/session.mocks';
import { nanoid } from 'nanoid';
import {
	createSessionHandler,
	deleteSessionHandler,
} from '../controllers/session.controllers';
import { userPayload } from './mocks/user.mocks';

const app = createServer();

jest.mock('nanoid', () => ({
	nanoid: jest.fn(() => '4rcHM8Ch_g'),
}));

describe('session', () => {
	describe('create session', () => {
		describe('given the user provides a valid email and password', () => {
			it('should return a signed access and refresh token', async () => {
				jest
					.spyOn(UserService, 'getUserByEmail')
					// @ts-ignore
					.mockReturnValue(userPayload);
				jest
					.spyOn(SessionService, 'validatePassword')
					// @ts-ignore
					.mockReturnValue(true);
				jest
					.spyOn(SessionService, 'createSession')
					// @ts-ignore
					.mockReturnValue(sessionPayload);

				const req = {
					body: sessionBody,
					get: jest.fn(() => 'PostmanRuntime/7.28.4'),
				};

				const send = jest.fn();

				const res = {
					status: jest.fn(() => ({ send })),
					cookie: jest.fn(),
				};

				// @ts-ignore
				await createSessionHandler(req, res);

				expect(send).toHaveBeenCalledWith({
					accessToken: expect.any(String),
					refreshToken: expect.any(String),
				});
			});
		});
	});

	describe('session logout', () => {
		describe('given the user is authenticated', () => {
			it('should update the session to be invalid', async () => {
				// mock middleware
				app.use((req, res, next) => {
					res.locals.user = { sessionId };
					next();
				});

				jest
					.spyOn(SessionService, 'getSessionById')
					// @ts-ignore
					.mockReturnValue(sessionPayload);

				jest
					.spyOn(SessionService, 'updateSession')
					// @ts-ignore
					.mockReturnValue({ ...sessionPayload, isValid: false });

				const req = {};
				const res = {
					send: jest.fn(),
					locals: {
						user: { sessionId },
					},
				};

				// @ts-ignore
				await deleteSessionHandler(req, res);

				expect(res.send).toHaveBeenCalledWith({
					...sessionPayload,
					isValid: false,
				});
			});
		});
	});
});
