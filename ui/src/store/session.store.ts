import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createSelectors from './createSelectors';
import axios from '@/utils/axios';
import { LoginInput } from '@/schemas/session.schemas';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';

export type SessionState = {
	isAuthenticated: boolean;
	user: User | null;
};

export type SessionActions = {
	login: (values: LoginInput) => Promise<void>;
	logout: () => Promise<void>;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	setUser: (user: User | null) => void;
};

export type SessionStore = SessionState & SessionActions;

const initialState: SessionState = {
	isAuthenticated: false,
	user: null,
};

export const useSessionStore = create<SessionStore>()(
	persist(
		set => ({
			...initialState,
			login: async (values: LoginInput) => {
				try {
					const {
						data: { accessToken },
					} = await axios.post<{ accessToken: string }>(
						'/api/sessions',
						values
					);

					if (!accessToken) return;

					const user = jwtDecode<User>(accessToken);

					set({ isAuthenticated: true, user });
				} catch (error) {
					console.log('Error logging in', error);
					throw error;
				}
			},
			logout: async () => {
				try {
					await axios.delete('/api/sessions');
					set({ ...initialState });
				} catch (error) {
					console.log('Error logging out', error);
					throw error;
				}
			},
			setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),
			setUser: user => set({ user }),
		}),
		{
			name: 'session-storage',
		}
	)
);

export const useSessionSelectors = createSelectors(useSessionStore);
