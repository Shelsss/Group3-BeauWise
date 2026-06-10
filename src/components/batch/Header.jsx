import Colors from '@/constants/Colors';
import { View, Text, Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SingleSidedShadow from '../SingleSidedShadow';

export default function BatchHeader({ title }) {
	const { top } = useSafeAreaInsets();

	return (
		<SingleSidedShadow hasDefaultStyle={true}>
			<View
				style={{
					backgroundColor: '#f8fafc',
					paddingTop: top + 10,
					padding: 16,
					flexDirection: 'row',
					columnGap: 12,
					alignItems: 'center',
					borderBottomStartRadius: 16,
					borderBottomEndRadius: 16,

					shadowColor: '#000',
					shadowOffset: { width: 1, height: 1 },
					shadowOpacity: 0.4,
					shadowRadius: 3,
					elevation: 8
				}}
			>
				<Pressable onPress={() => router.back()}>
					<ArrowLeft color={Colors.textColor} size={18} />
				</Pressable>
				<Text
					style={{
						fontFamily: 'Outfit',
						color: Colors.textColor,
						fontSize: 18,
						fontWeight: 700
					}}
				>
					{title}
				</Text>
			</View>
		</SingleSidedShadow>
	);
}
