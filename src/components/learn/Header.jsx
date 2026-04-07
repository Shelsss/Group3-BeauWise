import Colors from '@/constants/Colors';
import { View, Text, Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LearnHeader({ title }) {
	const { top } = useSafeAreaInsets();

	return (
		<Shadow stretch={true} distance={4} startColor='#00000010' offset={[0, 1]}>
			<View
				style={{
					backgroundColor: '#f8fafc',
					paddingTop: top + 10,
					padding: 16,
					flexDirection: 'row',
					columnGap: 12,
					alignItems: 'center',
					borderBottomStartRadius: 16,
					borderBottomEndRadius: 16
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
		</Shadow>
	);
}
