import { create } from 'zustand';

export const useHistoryStore = create((set) => ({
	filter: 'all_time',
	setFilter: (value) => set(() => ({ filter: value })),

	index: 0,
	setIndex: (value) => set(() => ({ index: value })),

	query: null,
	setQuery: (value) => set(() => ({ query: value }))
}));
