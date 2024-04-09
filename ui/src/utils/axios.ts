import axios from 'axios';
import { env } from '../../config/env';
import { useSessionStore } from '@/stores/session.store';

const sharedOptions = {
	baseURL: env.NEXT_PUBLIC_SERVER_ENDPOINT,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
};

export default axios.create({
	...sharedOptions,
});

export const axiosAuth = axios.create({
	...sharedOptions,
});

axiosAuth.interceptors.request.use(config => {
	const accessToken = useSessionStore.getState().accessToken;
	config.headers.Authorization = `Bearer ${accessToken}`;
	return config;
});
