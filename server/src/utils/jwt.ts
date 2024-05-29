import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export type JwtPayload<T> = {
	isValid: boolean;
	isExpired: boolean;
	data: T | null;
	error?: string;
};

function decodeBase64(base64String: string): string {
	return Buffer.from(base64String, 'base64').toString('ascii');
}

export function signJwt(
	payload: Object,
	tokenType: 'access' | 'refresh' = 'access',
	options?: jwt.SignOptions
): string {
	const base64String =
		tokenType === 'access'
			? env.ACCESS_TOKEN_PRIVATE_KEY
			: env.REFRESH_TOKEN_PRIVATE_KEY;

	const key = decodeBase64(base64String);

	return jwt.sign(payload, key, {
		...(options && options),
		algorithm: 'RS256',
	});
}

export function verifyJwt<T>(
	token: string,
	tokenType: 'access' | 'refresh' = 'access'
): JwtPayload<T> {
	const base64String =
		tokenType === 'access'
			? env.ACCESS_TOKEN_PUBLIC_KEY
			: env.REFRESH_TOKEN_PUBLIC_KEY;

	const key = decodeBase64(base64String);

	try {
		const decoded = jwt.verify(token, key, { algorithms: ['RS256'] }) as T;
		return {
			isValid: true,
			isExpired: false,
			data: decoded,
		};
	} catch (error: any) {
		return {
			isValid: false,
			isExpired: error.message === 'jwt expired',
			data: null,
			error: error.message,
		};
	}
}
