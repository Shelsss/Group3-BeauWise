import { create } from 'zustand';

export const useAuthStore = create((set) => ({
	isAuthenticated: false,
	setIsAuthenticated: (value) => set(() => ({ isAuthenticated: value })),

	revokeVisible: false,
	setRevokeVisible: (value) => set(() => ({ revokeVisible: value })),

	cancelDeletionVisible: false,
	setCancelDeletionVisible: (value) => set(() => ({ cancelDeletionVisible: value }))
}));
