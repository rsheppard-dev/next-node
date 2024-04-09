import { User } from '@/types/user';
import { axiosAuth } from '@/utils/axios';
import { create } from 'zustand';

export type UserState = {
	user: User | null;
};

export type UserActions = {
	register: () => Promise<void>;
	update: () => Promise<void>;
	delete: () => Promise<void>;
};

export type UserStore = UserState & UserActions;

const initialState: UserState = {
	user: null,
};

export const useUserStore = create<UserStore>()((set, get) => ({
	...initialState,
	register: async (): Promise<void> => {
		try {
			const user = await axiosAuth.post<User>('/api/users');
		} catch (error) {
			console.log('Error registering user', error);
		}
	},
	update: async (): Promise<void> => {
		try {
			const user = await axiosAuth.put<User>('/api/users');
		} catch (error) {
			console.log('Error updating user', error);
		}
	},
	delete: async (): Promise<void> => {
		try {
			await axiosAuth.delete('/api/users');
			return set(initialState);
		} catch (error) {
			console.log('Error deleting user', error);
		}
	},
}));
