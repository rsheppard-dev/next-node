import axios from 'axios';
import { env } from '../../config/env';

const options = {
	baseURL: env.NEXT_PUBLIC_SERVER_ENDPOINT,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
};

export default axios.create({
	...options,
});
