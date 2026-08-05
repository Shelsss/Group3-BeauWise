import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Animated from 'react-native-reanimated';
import styles from '@/config/styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PressableBadge({
	label,
	handlePress,
	activeCondition,
	activeTheme
}) {
	return (
		<AnimatedPressable
			onPress={() => {
				handlePress();
			}}
			style={{
				paddingHorizontal: 20,
				paddingVertical: 6,
				backgroundColor: activeCondition ? Colors.primary + '1A' : 'transparent',
				borderRadius: 20,
				borderColor: activeCondition
					? Colors.primary + '4D'
					: styles.theme.colors[activeTheme].card_border,
				borderWidth: 1,
				overflow: 'hidden',
				transitionDuration: 200
			}}
			android_ripple={{ color: '#51515123', foreground: true }}
		>
			<Animated.Text
				style={{
					fontFamily: 'Outfit',
					color: activeCondition
						? Colors.primary
						: styles.theme.colors[activeTheme].text + '9a',
					fontSize: 12,
					fontWeight: styles.font.weight.light,
					transitionDuration: 200
				}}
			>
				{label}
			</Animated.Text>
		</AnimatedPressable>
	);
}
