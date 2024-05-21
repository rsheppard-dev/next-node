import { create } from 'zustand';
import createSelectors from './createSelectors';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SessionState = {
	isLoggedIn: boolean;
	user: SessionUser | null;
};

export type SessionActions = {
	createSession: (user: SessionUser) => void;
	deleteSession: () => void;
};

export type SessionStore = SessionState & SessionActions;

const initialState: SessionState = {
	isLoggedIn: false,
	user: null,
};

export const useSessionStore = create<SessionStore>()(
	persist(
		set => ({
			...initialState,
			createSession: (user: SessionUser) => set({ user, isLoggedIn: true }),
			deleteSession: () => set({ ...initialState }),
		}),
		{
			name: 'session-storage',
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);

export const useSessionSelectors = createSelectors(useSessionStore);
