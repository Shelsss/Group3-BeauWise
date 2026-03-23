import { Slot, useLocalSearchParams } from 'expo-router';
import LearnHeader from '@/components/learn/Header';
import { View } from 'react-native';

export default function Layout() {
	const { category } = useLocalSearchParams();
	const currentRoute = category
		.match(/\[(.*?)\]/)[1]
		.split('_')
		.map((string) => string.charAt(0).toUpperCase() + string.slice(1))
		.join(' ');

	return (
		<>
			<View style={{ zIndex: 3 }}>
				<LearnHeader title={currentRoute} />
			</View>
			<Slot />
		</>
	);
}
