import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialProfileState = {
	about_you: {
		gender: '',
		age: ''
	},

	the_wash_test: {
		post_wash_feel: '',
		pore_size: '',
		mid_day_shine: ''
	},

	sensitivity_reactivity: {
		product_reactivity: '',
		redness_prone: ''
	},

	acne_texture: {
		breakout_frequency: '',
		texture_concern: ''
	},

	environmental_factors: {
		climate_reactivity: ''
	},

	hair_length_structure: {
		hair_length: ''
	},

	hair_classification: {
		hair_pattern: '',
		hair_texture: '',
		hair_scalp_density: ''
	},

	hair_porosity: {
		water_absorption: '',
		air_dry_time: ''
	},

	scalp_health: {
		scalp_condition: '',
		primary_concern: ''
	},

	hair_care_routine: {
		wash_frequency: '',
		chemical_treatments: [],
		product_knowledge: ''
	}
};

export const useProfilingStore = create(
	immer((set) => ({
		profile: initialProfileState,
		setProfile: (section, key, value) =>
			set((state) => {
				if (Array.isArray(state.profile[section][key])) {
					const currentArray = state.profile[section][key];

					if (currentArray.includes(value)) {
						const updatedArray = currentArray.filter((item) => item !== value);
						if (updatedArray.length < 1) return;
						state.profile[section][key] = updatedArray;

						return;
					}

					if (currentArray.includes('none_virgin_hair')) {
						state.profile[section][key] = currentArray.filter(
							(item) => item !== 'none_virgin_hair'
						);
					}

					if (value === 'none_virgin_hair') {
						state.profile[section][key] = [value];
						return;
					}

					state.profile[section][key].push(value);
					return;
				}

				state.profile[section][key] = value;
			}),

		resetProfile: () => set(() => ({ profile: initialProfileState })),

		isProfilingComplete: false,
		setIsProfilingComplete: (isProfilingComplete) => set(() => ({ isProfilingComplete })),

		isInitialStepButtonActive: true,
		setIsInitialStepButtonActive: (isInitialStepButtonActive) =>
			set(() => ({ isInitialStepButtonActive }))
	}))
);
