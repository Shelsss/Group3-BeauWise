import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';
import { createAnimatedComponent } from 'react-native-reanimated';

const AnimatedPressable = createAnimatedComponent(Pressable);

export default function PrimaryButton({
	children,
	handlePress,
	styles,
	containerStyle,
	disabled
}) {
	return (
		<AnimatedPressable
			style={[
				{
					borderRadius: 24,
					overflow: 'hidden',
					shadowColor: '#00000052',
					shadowOffset: {
						width: 0,
						height: 0
					},
					shadowOpacity: 0.17,
					shadowRadius: 3.05,
					elevation: 4,
					opacity: disabled ? 0.45 : 1,
					transitionDuration: 400
				},
				{ ...containerStyle }
			]}
			disabled={disabled}
			android_ripple={{ color: '#e0dada6a', foreground: true }}
			onPress={handlePress}
		>
			<LinearGradient
				start={{ x: 0.3, y: 0.7 }}
				end={{ x: 1, y: 0.2 }}
				colors={['#b8a4f5', '#ffb9ca']}
				style={{
					padding: 16
				}}
			>
				<View
					style={[
						{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						},
						{ ...styles }
					]}
				>
					{children}
				</View>
			</LinearGradient>
		</AnimatedPressable>
	);
}
