import { storage } from '@/config/mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const zustandStorage = {
	setItem: (name, value) => storage.set(name, value),
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => storage.remove(name)
};

export const useThemeStore = create(
	persist(
		(set) => ({
			themeMode: 'system',
			setThemeMode: (mode) => set({ themeMode: mode })
		}),
		{
			name: 'theme-storage',
			storage: createJSONStorage(() => zustandStorage)
		}
	)
);
