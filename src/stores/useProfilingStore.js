import Questionnaire from '@/constants/Questionnaire';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const initialProfileState = {
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
		texture_concern: []
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
		scalp_condition: [],
		primary_concern: []
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
		setProfile: (section, key, value, onSavingDB = false) =>
			set((state) => {
				if (Array.isArray(state.profile[section][key])) {
					if (Array.isArray(value)) {
						state.profile[section][key] = [...value];
						return;
					}

					const currentArray = state.profile[section][key];
					const foo = Questionnaire.find((item) => item.section === section)
						.questions.find(({ identifier }) => identifier === key)
						.options.find(({ label }) => label.includes('None'));

					if (currentArray.includes(value)) {
						const updatedArray = currentArray.filter((item) => item !== value);
						if (updatedArray.length < 1) return;
						state.profile[section][key] = updatedArray;

						return;
					}

					if (currentArray.includes(foo?.value)) {
						state.profile[section][key] = currentArray.filter(
							(item) => item !== foo?.value
						);
					}

					if (value === foo?.value) {
						state.profile[section][key] = [value];
						return;
					}

					state.profile[section][key].push(value);
					return;
				}

				state.profile[section][key] = value;
			}),

		// This will only be use if it already has a profiling data in db.
		populateProfile: (data) => set(() => ({ profile: data })),

		resetProfile: () => set(() => ({ profile: initialProfileState })),

		isProfilingComplete: false,
		setIsProfilingComplete: (isProfilingComplete) => set(() => ({ isProfilingComplete })),

		isInitialStepButtonActive: true,
		setIsInitialStepButtonActive: (isInitialStepButtonActive) =>
			set(() => ({ isInitialStepButtonActive })),

		showProfileZoom: false,
		setShowProfileZoom: (showProfileZoom) => set(() => ({ showProfileZoom })),

		imageZoomSrc: null,
		setImageZoomSrc: (value) => set(() => ({ imageZoomSrc: value })),

		slideDirection: 'forward',
		setSlideDirection: (value) => set(() => ({ slideDirection: value }))
	}))
);
