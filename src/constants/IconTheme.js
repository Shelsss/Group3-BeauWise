import Face from '@/components/icons/Face';
import CalendarSync from '@/components/icons/hugeicons/CalendarSync';
import Droplet from '@/components/icons/hugeicons/Droplet';
import Hair from '@/components/icons/hugeicons/Hair';
import Measure from '@/components/icons/hugeicons/Measure';
import Pattern from '@/components/icons/hugeicons/Pattern';
import SunSnow from '@/components/icons/hugeicons/SunSnow';
import TestTube2 from '@/components/icons/hugeicons/TestTube2';
import Texture from '@/components/icons/hugeicons/Texture';
import Warn2 from '@/components/icons/hugeicons/Warn2';
import Shampoo from '@/components/icons/Shampoo';

import {
	TriangleAlert,
	FingerprintPattern,
	SunMoon,
	Heart,
	Scissors,
	Wind,
	Droplets
} from 'lucide-react-native';

export const icons = [
	{
		icon: (size, color) => <Droplet color={color} size={size} />,
		id: 'the_wash_test'
	},

	{
		icon: (size, color) => <Warn2 color={color} size={size} />,
		id: 'sensitivity_reactivity'
	},

	{
		icon: (size, color) => <Texture color={color} size={size} />,
		id: 'acne_texture'
	},

	{
		icon: (size, color) => <SunSnow color={color} size={size} />,
		id: 'environmental_factors'
	},

	{
		icon: (size, color) => <Measure color={color} size={size} />,
		id: 'hair_length_structure'
	},

	{
		icon: (size, color) => <Pattern color={color} size={size} />,
		id: 'hair_classification'
	},

	{
		icon: (size, color) => <TestTube2 color={color} size={size} />,
		id: 'hair_porosity'
	},

	{
		icon: (size, color) => <Hair color={color} size={size} />,
		id: 'scalp_health'
	},

	{
		icon: (size, color) => <CalendarSync color={color} size={size} />,
		id: 'hair_care_routine'
	}
];
