const SHADOW_COLOR = '#00000094';

const BASE_COLORS = {
	_01: '#0F172A',
	_02: '#475569',
	_03: '#94A3B8',
	_04: '#ffffff'
};

export default {
	font: {
		weight: {
			semi_light: 200,
			light: 300,
			regular: 400,
			semi_bold: 500,
			bold: 600,
			extra_bold: 700
		},

		family: 'Outfit',
		size: {
			three_xxl: 30,
			two_xxl: 28,
			one_xxl: 26,
			three_xl: 24,
			double_xl: 22,
			one_xl: 20,
			xxl: 18,
			xl: 16,
			lg: 14,
			md: 12,
			sm: 10,
			xs: 8
		},

		colors: {
			...BASE_COLORS
		}
	},

	background_color: {
		...BASE_COLORS
	},

	icon: {
		size: {
			xl: 16,
			lg: 14,
			md: 12,
			sm: 10,
			xs: 8
		},

		colors: {
			_01: '#ff6565',
			_02: '#0F172A',
			_03: '#475569',
			_04: '#94A3B8',
			_05: '#ffffff'
		}
	},

	shadow: {
		none: {
			shadowColor: 'transparent',
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0
		},

		sm: {
			shadowColor: SHADOW_COLOR,
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.18,
			shadowRadius: 1.0,
			elevation: 1
		},

		md: {
			shadowColor: SHADOW_COLOR,
			shadowOffset: { width: 0, height: 3 },
			shadowOpacity: 0.2,
			shadowRadius: 4.65,
			elevation: 4
		},

		lg: {
			shadowColor: SHADOW_COLOR,
			shadowOffset: { width: 0, height: 5 },
			shadowOpacity: 0.25,
			shadowRadius: 6.84,
			elevation: 8
		},

		xl: {
			shadowColor: SHADOW_COLOR,
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.3,
			shadowRadius: 10.32,
			elevation: 16
		}
	},

	border: {
		radius: {
			colors: {
				_01: '#ff6565',
				_02: '#0F172A',
				_03: '#475569',
				_04: '#94A3B8',
				_05: '#ffffff'
			},

			size: {
				none: 0,
				sm: 8,
				md: 14,
				lg: 24,
				pill: 999
			}
		}
	},

	spacing: {
		none: 0,
		xs: 2,
		sm: 4,
		md: 6,
		lg: 8,
		xl: 12,
		xxl: 14,

		one_xl: 16,
		double_xl: 18,
		three_xl: 20,

		one_xxl: 24,
		double_xxl: 28,
		three_xxl: 32
	},

	theme: {
		colors: {
			primary: '#8B78FF',
			primary_tint: '#8B78FF1A',

			batch: '#3B82F6',
			fda: '#16A34A',

			status: {
				green: '#22C55E',
				red: '#EF4444',
				yellow: '#F59E0B'
			},

			light: {
				input_background: '#f7f7f7',
				input_border: 'transparent',
				screen_background: '#FFFFFF',
				card_background: '#FFFFFF',
				card_border: '#E8E5F2',
				text: '#0F172A',
				text_secondary: '#475569',

				icon: '#0F172A',

				tip_background: '#EFF6FF',
				tip_border: '#BFDBFE',
				tip_icon: '#1E3A8A',
				tip_text: '#1E3A8A',

				text_seperator: '#989898',
				seperator: '#b5b5b6',

				batch_border: '#3B82F6',
				batch_text: '#3B82F6',
				batch_background: '#F7F8FA',

				warn_icon: '#991B1B',
				warn_background: '#FEF2F2',
				warn_border: '#FECACA',
				warn_text: '#991B1B',

				disclaimer_icon: '#9A3412',
				disclaimer_background: '#FFF7ED',
				disclaimer_border: '#FED7AA',
				disclaimer_text: '#9A3412',

				fda_border: '#16A34A',
				fda_text: '#16A34A',
				fda_background: '#F7F8FA'
			},

			dark: {
				input_background: '#16243a',
				input_border: '#334155',
				screen_background: '#0F172A',
				card_background: '#1E293B',
				card_border: '#334155',
				text: '#FFFFFF',
				text_secondary: '#94A3B8',

				icon: '#FFFFFF',

				tip_background: '#0A1E3A',
				tip_border: '#1D4ED8',
				tip_icon: '#BFDBFE',
				tip_text: '#BFDBFE',

				text_seperator: '#394960',
				seperator: '#334155',

				batch_border: '#3B82F6',
				batch_text: '#FFFFFF',
				batch_background: '#1E3A5F',

				warn_icon: '#FCA5A5',
				warn_background: '#3B0A0A',
				warn_border: '#7F1D1D',
				warn_text: '#FCA5A5',

				disclaimer_icon: '#FDE68A',
				disclaimer_background: '#2A1A05',
				disclaimer_border: '#B45309',
				disclaimer_text: '#FDE68A',

				fda_border: '#16A34A',
				fda_text: '#FFFFFF',
				fda_background: '#0F3A2A'
				// screen_background: '#0F172A',
				// card: '#1E293B',
				// input: '#111C2E',
				// border: '#334155',
				// batch: '#1E3A5F',
				// fda: '#0F3A2A',
				// disclaimer_warning_background: '#3B0A0A',
				// disclaimer_warnning_text: '#FCA5A5',
				// disclaimer_warning_border: '#7F1D1D',
				// disclaimer_caution_background: '#2A1A05',
				// disclaimer_caution_text: '#FDE68A',
				// disclaimer_caution_border: '#B45309',
				// tip_background: '#0A1E3A',
				// tip_text: '#BFDBFE',
				// tip_border: '#1D4ED8'
			}
		}
	}
};
