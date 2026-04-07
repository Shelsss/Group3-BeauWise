import Colors from '@/constants/Colors';
import { View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

export default function CustomHeader({ title, children, disableShadow }) {
	const { top } = useSafeAreaInsets();

	return (
		<Shadow
			distance={4}
			stretch={true}
			startColor='#00000010'
			offset={[0, 0]}
			disabled={disableShadow}
		>
			<View
				style={{
					backgroundColor: Colors.backgroundColor,

					paddingHorizontal: 15,
					paddingTop: top - 10,
					paddingBottom: 16,

					borderBottomStartRadius: title !== 'History' ? 16 : 0,
					borderBottomEndRadius: title !== 'History' ? 16 : 0,
					shadowColor: '#000',
					shadowOffset: {
						width: 20,
						height: 10
					},
					shadowOpacity: 0.25,
					shadowRadius: 20
				}}
			>
				<Animated.Text
					entering={SlideInLeft}
					style={{
						letterSpacing: 4,
						fontSize: 30,
						fontWeight: '900',
						color: Colors.primary
					}}
				>
					{title === 'Home' ? 'BeauWise' : title}
				</Animated.Text>

				{children}
			</View>
		</Shadow>
	);
}
