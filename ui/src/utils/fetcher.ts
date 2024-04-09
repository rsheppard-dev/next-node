import { axiosAuth } from './axios';

export default async function fetcher<T>(url: string): Promise<T> {
	const result = await axiosAuth.get<T>(url);
	return result.data;
}
