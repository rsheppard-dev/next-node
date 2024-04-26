import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createSelectors from './createSelectors';

export type SessionState = {
	isAuthenticated: boolean;
};

export type SessionActions = {
	logout: () => void;
	login: () => void;
};

export type SessionStore = SessionState & SessionActions;

const initialState: SessionState = {
	isAuthenticated: false,
};

export const useSessionStore = create<SessionStore>()(
	persist(
		set => ({
			...initialState,
			logout: () => {
				set({ isAuthenticated: false });
			},
			login: () => {
				set({ isAuthenticated: true });
			},
		}),
		{
			name: 'session-storage',
		}
	)
);

export const useSessionSelectors = createSelectors(useSessionStore);
