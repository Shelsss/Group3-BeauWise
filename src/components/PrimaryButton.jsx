import Colors from '@/constants/Colors';
import { TouchableOpacity, View } from 'react-native';
import {
	createAnimatedComponent,
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);
export default function PrimaryButton({
	children,
	handlePress,
	styles,
	containerStyle,
	disabled
}) {
	return (
		<AnimatedTouchableOpacity
			layout={LinearTransition.springify().damping(120)}
			entering={FadeIn}
			exiting={FadeOut.duration(180)}
			activeOpacity={0.7}
			style={[
				{
					backgroundColor: Colors.primary,
					padding: 16,
					borderRadius: 10,
					overflow: 'hidden',
					shadowColor: '#00000052',
					shadowOffset: {
						width: 0,
						height: 0
					},
					shadowOpacity: 0.17,
					shadowRadius: 3.05,
					elevation: 4
				},
				{ ...styles }
			]}
			disabled={disabled}
			onPress={handlePress}
		>
			{children}
		</AnimatedTouchableOpacity>
	);
}
