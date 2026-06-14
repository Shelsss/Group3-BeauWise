import { randomUUID } from 'expo-crypto';

export default [
	{
		title: 'The Wash Test',
		section: 'the_wash_test',
		description: `Think about how your skin feels 30 minutes after 
        washing your face with a gentle cleanser, 
        before applying any moisturizer or toner.`,
		questions: [
			{
				label: '30 minutes after washing your face, how would you describe your skin?',
				identifier: 'post_wash_feel',
				id: randomUUID(),
				options: [
					{
						label: 'Tight & Stretched',
						value: 'tight_and_dry',
						description: `It feels stretched. (Dry indicator)`,
						image: require('assets/images/skin/prefer_not_to_say/tight_and_dry.webp'),
						id: randomUUID()
					},
					{
						label: 'Comfortable',
						value: 'comfortable',
						description: `It feels clean and smooth, neither tight nor oily. (Normal indicator)`,
						image: require('assets/images/skin/prefer_not_to_say/comfortable.webp'),
						id: randomUUID()
					},
					{
						label: 'Oily in spots',
						value: 'oily_in_spots',
						description: `My forehead and nose (T-zone) are shiny, but my cheeks feel normal or dry. (Combination indicator)`,
						image: require('assets/images/skin/prefer_not_to_say/oily_in_spots.webp'),
						id: randomUUID()
					},
					{
						label: 'Greasy',
						value: 'greasy',
						description: ` I can feel oil or shine all over my face. (Oily indicator)`,
						image: require('assets/images/skin/prefer_not_to_say/greasy.webp'),
						id: randomUUID()
					}
				]
			},
			{
				label: 'Look at your pores in a mirror. How would you describe them?',
				identifier: 'pore_size',
				id: randomUUID(),
				options: [
					{
						label: 'Very Small',
						value: 'invisible_very_small',
						image: require('assets/images/skin/prefer_not_to_say/invisible_very_small.webp'),
						id: randomUUID()
					},
					{
						label: 'Visible in T-Zone',
						value: 'visible_in_t_zone',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/visible_in_t_zone.webp')
					},
					{
						label: 'Large / Visible Everywhere',
						value: 'large_visible_everywhere',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/large_visible_everywhere.webp')
					},
					{
						label: 'Normal',
						value: 'normal',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/normal.webp')
					}
				]
			},
			{
				label: `By mid-day (around 12:00 PM - 2:00 PM), how does your face look/feel?`,
				identifier: 'mid_day_shine',
				id: randomUUID(),
				options: [
					{
						label: 'Dry',
						value: 'flaky_dull',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/flaky_dull.webp')
					},
					{
						label: 'Normal',
						value: 'radiant_normal',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/radiant_normal.webp')
					},
					{
						label: 'Shiny T-Zone',
						value: 'shiny_t_zone',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/shiny_t_zone.webp')
					},
					{
						label: 'Very Shiny',
						value: 'very_shiny',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/very_shiny.webp')
					}
				]
			}
		]
	},

	{
		title: 'Sensitivity & Reactivity',
		section: 'sensitivity_reactivity',
		description: 'How your skin reacts to products and triggers',
		questions: [
			{
				label: ` How often does your skin become red, itchy, or sting after using new products (soap, cream, perfume)?`,
				identifier: 'product_reactivity',
				id: randomUUID(),
				options: [
					{
						label: 'Never',
						description: `My skin is very resilient`,
						value: 'never',
						image: require('assets/images/skin/prefer_not_to_say/never.webp'),
						id: randomUUID()
					},
					{
						label: 'Rarely',
						description: `Only with very harsh products`,
						image: require('assets/images/skin/prefer_not_to_say/rarely.webp'),
						value: 'rarely',
						id: randomUUID()
					},
					{
						label: 'Sometimes',
						description: `Certain ingredients trigger a reaction`,
						value: 'sometimes',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/sometimes.webp')
					},
					{
						label: 'Frequently',
						description: `I have to be very careful`,
						value: 'frequently',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/frequently_sensitivity.webp')
					}
				]
			},
			{
				label: 'Does your face get red or flushed easily?',
				identifier: 'redness_prone',
				id: randomUUID(),
				options: [
					{
						label: 'No, never',
						value: 'no_never',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/no_never.webp')
					},
					{
						label: 'Occasionally',
						value: 'occasionally',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/occasionally.webp')
					},
					{
						label: 'Yes, very easily and it stays red for a while',
						value: 'yes_very_easily',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/yes_very_easily.webp')
					}
				]
			}
		]
	},

	{
		title: 'Acne & Texture',
		section: 'acne_texture',
		description: 'Breakouts and skin texture concerns',
		questions: [
			{
				label: 'How often do you experience acne breakouts (pimples/zits)?',
				identifier: 'breakout_frequency',
				id: randomUUID(),
				options: [
					{
						label: 'Never / Very Rarely',
						value: 'never_very_rarely',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/never_very_rarely.webp')
					},
					{
						label: 'Monthly',
						description: `Usually hormonal or random`,
						value: 'monthly',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/monthly.webp')
					},
					{
						label: 'Frequently',
						description: `Almost always have one pimple`,
						value: 'frequently',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/frequently.webp')
					},
					{
						label: 'Constantly',
						description: `Multiple breakouts covering large areas`,
						value: 'constantly',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/constantly.webp')
					}
				]
			},
			{
				label: 'Which texture issue bothers you the most? (Select all that apply)',
				identifier: 'texture_concern',
				id: randomUUID(),
				multiSelect: true,
				options: [
					{
						label: 'Rough / Flaky patches',
						description: `Associated with dry skin`,
						value: 'rough_flaky_patches',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/rough_flaky_patches.webp')
					},
					{
						label: 'Blackheads / Whiteheads',
						description: `Associated with oily or combination skin`,
						value: 'blackheads_whiteheads',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/blackheads_whiteheads.webp')
					},
					{
						label: 'Redness / Inflammation',
						description: `Associated with sensitive skin`,
						value: 'redness_inflammation',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/redness_inflammation.webp')
					},
					{
						label: 'None / Smooth Texture',
						value: 'none_smooth_texture',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/none_smooth_texture.webp')
					}
				]
			}
		]
	},

	{
		title: 'Environmental Factors',
		section: 'environmental_factors',
		description: 'How your skin reacts to climate',
		showCheckPointAfter: true,
		checkpoint: {
			title: 'Skin Profiling Complete!',
			description: `Next, we'll assess your hair and scalp to improve haircare and ingredient compatibility.`
		},
		questions: [
			{
				label: 'How does your skin react to cold or air-conditioned environments?',
				identifier: 'climate_reactivity',
				id: randomUUID(),
				options: [
					{
						label: 'It feels essentially the same',
						value: 'feels_the_same',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/feels_the_same.webp')
					},
					{
						label: 'It gets a little drier but manageable',
						value: 'little_drier',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/little_drier.webp')
					},
					{
						label: 'It becomes painfully dry, cracked, or chapped',
						value: 'painfully_dry',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/painfully_dry.webp')
					},
					{
						label: 'It actually gets oilier (compensating for dryness)',
						value: 'gets_oilier',
						id: randomUUID(),
						image: require('assets/images/skin/prefer_not_to_say/gets_oilier.webp')
					}
				]
			}
		]
	},

	{
		title: 'Hair Length and Structure',
		section: 'hair_length_structure',
		description: 'Basic information about your hair',
		questions: [
			{
				label: 'What is your current hair length?',
				identifier: 'hair_length',
				id: randomUUID(),
				options: [
					{
						label: 'Buzz cut / Very short',
						description: 'Less than one inch',
						value: 'buzz_cut_very_short',
						id: randomUUID(),
						image: require('assets/images/hair/buzz_cut_very_short_length.webp')
					},
					{
						label: 'Short',
						description: 'Ear length or above',
						value: 'short_ear_length',
						id: randomUUID(),
						image: require('assets/images/hair/short_ear_length.webp')
					},
					{
						label: 'Medium',
						description: 'Between chin and shoulders length',
						value: 'medium_shoulder_length',
						id: randomUUID(),
						image: require('assets/images/hair/medium_shoulder_length.webp')
					},
					{
						label: 'Long',
						description: 'Below the shoulders',
						value: 'long_below_shoulders',
						id: randomUUID(),
						image: require('assets/images/hair/long_below_shoulders_length.webp')
					},
					{
						label: 'Very Long',
						description: 'Mid-back or longer',
						value: 'very_long_mid_back',
						id: randomUUID(),
						image: require('assets/images/hair/very_long_mid_back_length.webp')
					}
				]
			}
		]
	},
	{
		title: 'Hair Classification',
		section: 'hair_classification',
		description: 'Texture and structure classification',
		questions: [
			{
				label: `Which description best matches your natural hair pattern (without styling products)?`,
				identifier: 'hair_pattern',
				id: randomUUID(),
				options: [
					{
						label: 'Type 1 (Straight)',
						description: 'No curl, or wave; lies flat against the head.',
						value: 'type_one_straight',
						id: randomUUID(),
						image: require('assets/images/hair/type_one_straight.webp')
					},
					{
						label: 'Type 2 (Wavy)',
						description: `Has a loose "S" shape wave: lies flat at the roots but waves towards the ends.`,
						value: 'type_two_wavy',
						id: randomUUID(),
						image: require('assets/images/hair/type_two_wavy.webp')
					},
					{
						label: 'Type 3 (Curly)',
						description: `Defined loops or ringlets (ranging from sidewalk chalk to pencil width).`,
						value: 'type_three_curly',
						id: randomUUID(),
						image: require('assets/images/hair/type_three_curly.webp')
					},
					{
						label: 'Type 4 (Coily/Kinky)',
						description: `Tight coils or Z-pattern; densely packed and experiences shrinkage.`,
						value: 'type_four_coily_kinky',
						id: randomUUID(),
						image: require('assets/images/hair/type_four_coily_kinky.webp')
					}
				]
			},

			{
				label: `How would you describe the thickness of a single strand of your hair? (Texture)`,
				identifier: 'hair_texture',
				id: randomUUID(),
				options: [
					{
						label: 'Fine',
						description: `Barely felt when rolled between fingers; looks sheer in light.`,
						value: 'fine',
						id: randomUUID(),
						image: require('assets/images/hair/fine_texture.webp')
					},
					{
						label: 'Medium',
						description: `Felt like a cotton thread; solid color.`,
						value: 'medium',
						id: randomUUID(),
						image: require('assets/images/hair/medium_texture.webp')
					},
					{
						label: 'Coarse',
						description: `Felt distinctly like a wire; strong and thick.`,
						value: 'coarse',
						id: randomUUID(),
						image: require('assets/images/hair/coarse_texture.webp')
					}
				]
			},

			{
				label: `How easy is it to see your scalp through your hair without parting it? (Density)`,
				identifier: 'hair_scalp_density',
				id: randomUUID(),
				options: [
					{
						label: 'High Density',
						description: `I cannot see my scalp at all`,
						value: 'high',
						id: randomUUID(),
						image: require('assets/images/hair/high_density.webp')
					},
					{
						label: 'Medium Density',
						description: ` I can see a little bit of scalp.`,
						value: 'medium',
						id: randomUUID(),
						image: require('assets/images/hair/medium_density.webp')
					},
					{
						label: 'Low Density',
						description: `My scalp is very visible.`,
						value: 'low',
						id: randomUUID(),
						image: require('assets/images/hair/low_density.webp')
					}
				]
			}
		]
	},
	{
		title: 'Hair Porosity',
		section: 'hair_porosity',
		description: 'Moisture absorption indicators',
		questions: [
			{
				label: 'When you spray water on your dry hair, what happens?',
				identifier: 'water_absorption',
				id: randomUUID(),
				options: [
					{
						label: 'Beads up Water (Low Porosity Indicator)',
						description: `Water sits on top of the hair in droplets for a while.`,
						value: 'low_porosity',
						id: randomUUID(),
						image: require('assets/images/hair/low_porosity.webp')
					},
					{
						label: 'Absorbs slowly (Normal Porosity Indicator)',
						description: `Water sinks in after a minute or two.`,
						value: 'normal_porosity',
						id: randomUUID(),
						image: require('assets/images/hair/normal_porosity.webp')
					},
					{
						label: 'Absorbs instantly (High Porosity Indicator)',
						description: `Water disappears into the hair immediately.`,
						value: 'high_porosity',
						id: randomUUID(),
						image: require('assets/images/hair/high_porosity.webp')
					}
				]
			},
			{
				label: 'How long does your hair take to air-dry?',
				identifier: 'air_dry_time',
				id: randomUUID(),
				isRange: true,
				options: [
					{
						label: 'Very Fast',
						description: 'Less than 1 hour',
						value: 'very_fast',
						id: randomUUID()
					},
					{
						label: 'Average',
						description: '1-3 hours',
						value: 'average',
						id: randomUUID()
					},
					{
						label: 'Slow',
						description: '3-5 hours',
						value: 'slow',
						id: randomUUID()
					},
					{
						label: 'Very Slow',
						description: 'More than 5 hours',
						value: 'very_slow',
						id: randomUUID()
					}
				]
			}
		]
	},
	{
		title: 'Scalp Health',
		section: 'scalp_health',
		description: 'Scalp condition and hair concerns',
		questions: [
			{
				label: 'How would you describe your scalp condition? (Select all that apply)',
				identifier: 'scalp_condition',
				id: randomUUID(),
				multiSelect: true,
				options: [
					{
						label: 'Oily',
						description: `Gets oily after a few hours of washing.`,
						value: 'oily',
						id: randomUUID(),
						image: require('assets/images/hair/oily_scalp.webp')
					},
					{
						label: 'Normal',
						description: `Gets oily 24 to 48 hours after washing.`,
						value: 'normal',
						id: randomUUID(),
						image: require('assets/images/hair/normal_scalp.webp')
					},
					{
						label: 'Dry',
						description: `Often feels tight or itchy.`,
						value: 'dry',
						id: randomUUID(),
						image: require('assets/images/hair/dry_scalp.webp')
					},
					{
						label: 'Sensitive',
						description: `Reacts easily to products (redness / irritation).`,
						value: 'sensitive',
						id: randomUUID(),
						image: require('assets/images/hair/sensitive_scalp.webp')
					},
					{
						label: 'Dandruff-prone',
						description: `Visible flakes are a recurring issue.`,
						value: 'dandruff_prone',
						id: randomUUID(),
						image: require('assets/images/hair/dandruff_prone_scalp.webp')
					}
				]
			},
			{
				label: 'What is your primary hair concern? (Select all that apply)',
				identifier: 'primary_concern',
				id: randomUUID(),
				multiSelect: true,
				options: [
					{
						label: 'Hair Fall / Thinning',
						value: 'hair_fall_thinning',
						id: randomUUID(),
						image: require('assets/images/hair/hair_fall_thinning.webp')
					},
					{
						label: 'Dryness / Damage / Split Ends',
						value: 'dryness_damage_split_ends',
						id: randomUUID(),
						image: require('assets/images/hair/dryness_damage_split_ends.webp')
					},
					{
						label: 'Frizz Control',
						value: 'frizz_control',
						id: randomUUID(),
						image: require('assets/images/hair/frizz_control.webp')
					},
					{
						label: 'Oily Scalp / Greasiness',
						value: 'oily_scalp_greasiness',
						id: randomUUID(),
						image: require('assets/images/hair/oily_scalp_greasiness.webp')
					},
					{
						label: 'Lack of Volume',
						value: 'lack_of_volume',
						id: randomUUID(),
						image: require('assets/images/hair/lack_of_volume.webp')
					},
					{
						label: 'None / I am satisfied',
						value: 'none_satisfied',
						id: randomUUID(),
						image: require('assets/images/hair/none_satisfied.webp')
					}
				]
			}
		]
	},
	{
		title: 'Hair Care Routine',
		section: 'hair_care_routine',
		description: 'Products and treatments you use',
		questions: [
			{
				label: 'How often do you wash your hair with shampoo?',
				identifier: 'wash_frequency',
				id: randomUUID(),
				isRange: true,
				options: [
					{
						label: 'Less than once a week',
						value: 'less_than_once_a_week',
						id: randomUUID()
					},
					{ label: 'Once a week', value: 'once_a_week', id: randomUUID() },
					{ label: 'Twice a week', value: 'twice_a_week', id: randomUUID() },
					{ label: 'Every other day', value: 'every_other_day', id: randomUUID() },
					{ label: 'Daily', value: 'daily', id: randomUUID() }
				]
			},
			{
				label: `Which of the following chemical treatments has your hair undergone in the last 12 months? (Select all that apply)`,
				identifier: 'chemical_treatments',
				id: randomUUID(),
				multiSelect: true,
				options: [
					{
						label: 'Coloring / Bleaching',
						value: 'coloring_bleaching',
						id: randomUUID(),
						image: require('assets/images/hair/coloring_bleaching.webp')
					},
					{
						label: 'Rebonding / Straightening',
						value: 'rebonding_straightening',
						id: randomUUID(),
						image: require('assets/images/hair/rebonding_straightening.webp')
					},
					{
						label: 'Perming',
						value: 'perming',
						id: randomUUID(),
						image: require('assets/images/hair/perming.webp')
					},
					{
						label: 'Keratin Treatment',
						value: 'keratin_treatment',
						id: randomUUID(),
						image: require('assets/images/hair/keratin_treatment.webp')
					},
					{
						label: 'None (Virgin Hair)',
						value: 'none_virgin_hair',
						id: randomUUID(),
						image: require('assets/images/hair/none_virgin_hair.webp')
					}
				]
			},
			{
				label: `On a scale of 1 to 5, how knowledgeable do you feel about choosing products for your specific hair type?`,
				identifier: 'product_knowledge',
				id: randomUUID(),
				isRange: true,
				options: [
					{
						label: '1',
						value: '1_not_knowledgeable',
						id: randomUUID()
					},
					{
						label: '2',
						value: '2_slightly_knowledgeable',
						id: randomUUID()
					},
					{
						label: '3',
						value: '3_moderately_knowledgeable',
						id: randomUUID()
					},
					{
						label: '4',
						value: '4_very_knowledgeable',
						id: randomUUID()
					},
					{
						label: '5',
						value: '5_expert',
						id: randomUUID()
					}
				]
			}
		]
	}
];
