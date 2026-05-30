import { create } from 'zustand';

export const useOnboardingStore = create((set) => ({
	isOnboardingComplete: false,
	setIsOnboardingComplete: (value) => set(() => ({ isOnboardingComplete: value }))
}));
