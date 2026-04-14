import { create } from 'zustand';

export const usePointStore = create((set) => ({
	point: { x: 0, y: 0 },

	setPoint: (point) => set(() => ({ point }))
}));
