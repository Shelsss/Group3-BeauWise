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

import Colors from './Colors';

export const icons = [
	{
		color: Colors.primary,
		icon: (size) => <Face color={Colors.primary} size={size} />
	},

	{
		color: '#747eff',
		icon: (size) => <Droplets color='#747eff' size={size} />
	},

	{
		color: '#ff6a6a',
		icon: (size) => <TriangleAlert color='#ff6a6a' size={size} />
	},

	{
		color: '#ffb26a',
		icon: (size) => <FingerprintPattern color='#ffb26a' size={size} />
	},

	{
		color: '#ebb915',
		icon: (size) => <SunMoon color='#ebb915' size={size} />
	},

	{
		color: '#ff6a6a',
		icon: (size) => <Heart color='#ff6a6a' size={size} />
	},

	{
		color: Colors.primary,
		icon: (size) => <Scissors color={Colors.primary} size={size} />
	},

	{
		color: '#24b67c',
		icon: (size) => <Wind color='#24b67c' size={size} />
	},

	{
		color: '#3b82f6',
		icon: (size) => <Droplet color='#3b82f6' size={size} />
	},

	{
		color: '#a78bfa',
		icon: (size) => <Shampoo color='#a78bfa' size={size} />
	},

	{
		color: '#ff6a6a',
		icon: (size) => <Heart color='#ff6a6a' size={size} />
	}
];
