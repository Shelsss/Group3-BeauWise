import Colors from '@/constants/Colors';
import { View, Text, Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SingleSidedShadow from '../SingleSidedShadow';

export default function LearnHeader({ title }) {
	const { top } = useSafeAreaInsets();

	return (
		<SingleSidedShadow>
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
					elevation: 5
				}}
			>
				<Pressable onPress={() => router.back()}>
					<ArrowLeft color={Colors.textColor} />
				</Pressable>
				<Text
					style={{
						color: Colors.textColor,
						fontSize: 24,
						fontWeight: 700
					}}
				>
					{title}
				</Text>

				{/* <View
						style={{
							backgroundColor: '#00ACC11a',
							marginLeft: 'auto',
							borderRadius: 20,
							padding: 10
						}}
					>
						<Archive color='#00ACC1' />
					</View> */}
			</View>
		</SingleSidedShadow>
	);
}
