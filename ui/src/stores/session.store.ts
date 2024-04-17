import { LoginInput } from '@/schemas/session.schemas';
import axios, { axiosAuth } from '@/utils/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createSelectors from './createSelectors';
import { User } from '@/types/user';
import { jwtDecode } from 'jwt-decode';

export type SessionState = {
	isAuthenticated: boolean;
	accessToken: string | null;
	user: User | null;
};

export type SessionActions = {
	login: (values: LoginInput) => Promise<void>;
	logout: () => Promise<void>;
	setAccessToken: (accessToken: string) => void;
};

export type SessionStore = SessionState & SessionActions;

const initialState: SessionState = {
	isAuthenticated: false,
	accessToken: null,
	user: null,
};

export const useSessionStore = create<SessionStore>()(
	persist(
		set => ({
			...initialState,
			setAccessToken: accessToken => {
				set({ accessToken });
			},
			login: async (values: LoginInput): Promise<void> => {
				try {
					const {
						data: { accessToken },
					} = await axios.post<{ accessToken: string }>(
						'/api/sessions',
						values
					);

					if (!accessToken) return set({ isAuthenticated: false });

					const user = jwtDecode<User>(accessToken);

					return set({ isAuthenticated: true, accessToken, user });
				} catch (error) {
					console.log('Error logging in', error);
					throw error;
				}
			},
			logout: async () => {
				try {
					await axiosAuth.delete('/api/sessions');

					return set(initialState);
				} catch (error) {
					console.log('Error logging out', error);
					throw error;
				}
			},
		}),
		{
			name: 'session-storage',
		}
	)
);

export const useSessionSelectors = createSelectors(useSessionStore);
