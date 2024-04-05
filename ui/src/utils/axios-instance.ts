import axios from 'axios';
import { env } from '../../config/env';

const instance = axios.create({
	withCredentials: true,
	baseURL: env.NEXT_PUBLIC_SERVER_ENDPOINT,
});

export default instance;
