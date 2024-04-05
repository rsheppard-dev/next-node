import instance from './axios-instance';

export default async function fetcher<T>(url: string): Promise<T> {
	const result = await instance.get<T>(url);
	return result.data;
}
