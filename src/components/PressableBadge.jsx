import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PressableBadge({ label, handlePress, activeCondition }) {
	return (
		<AnimatedPressable
			onPress={() => {
				handlePress();
			}}
			style={{
				paddingHorizontal: 20,
				paddingVertical: 6,
				backgroundColor: activeCondition ? Colors.primary + '1A' : '#86efad2e',
				borderRadius: 20,
				borderColor: activeCondition ? Colors.primary + '4D' : 'transparent',
				borderWidth: 1,
				overflow: 'hidden',
				transitionDuration: 200
			}}
			android_ripple={{ color: '#51515123', foreground: true }}
		>
			<Animated.Text
				style={{
					fontFamily: 'Outfit',
					color: activeCondition ? Colors.primary : '#646464',
					fontSize: 12,
					fontWeight: activeCondition ? '600' : '500',
					transitionDuration: 200
				}}
			>
				{label}
			</Animated.Text>
		</AnimatedPressable>
	);
}
