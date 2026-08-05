import { create } from 'zustand';

export const useScanStore = create((set) => ({
	imageBase64: null,
	setImageBase64: (value) => set(() => ({ imageBase64: value })),

	imageUri: null,
	setImageUri: (value) => set(() => ({ imageUri: value })),

	ingredients: [],
	setIngredients: (newIngredients) => set(() => ({ ingredients: newIngredients })),
	resetIngredients: () => set(() => ({ ingredients: [] }))
}));
