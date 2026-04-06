import Face from '@/components/icons/Face';
import Shampoo from '@/components/icons/Shampoo';

import {
	TriangleAlert,
	FingerprintPattern,
	SunMoon,
	Heart,
	Scissors,
	Wind,
	Droplet,
	Droplets
} from 'lucide-react-native';

export const icons = [
	{
		icon: (size, color) => <Face color={color} size={size} />
	},

	{
		icon: (size, color) => <Droplets color={color} size={size} />
	},

	{
		icon: (size, color) => <TriangleAlert color={color} size={size} />
	},

	{
		icon: (size, color) => <FingerprintPattern color={color} size={size} />
	},

	{
		icon: (size, color) => <SunMoon color={color} size={size} />
	},

	{
		icon: (size, color) => <Heart color={color} size={size} />
	},

	{
		icon: (size, color) => <Scissors color={color} size={size} />
	},

	{
		icon: (size, color) => <Wind color={color} size={size} />
	},

	{
		icon: (size, color) => <Droplet color={color} size={size} />
	},

	{
		icon: (size, color) => <Shampoo color={color} size={size} />
	},

	{
		icon: (size, color) => <Heart color={color} size={size} />
	}
];
