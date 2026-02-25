import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OptionItem({
	item,
	isSelected,
	handlePress,
	currentSection,
	selectedGender
}) {
	const scale = useSharedValue(1);

	const springConfig = {
		mass: 0.5,
		damping: 8,
		stiffness: 500
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		};
	});

	const handlePressIn = () => {
		scale.value = withSpring(0.97, springConfig);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, springConfig);
	};
	return (
		<AnimatedPressable
			style={[
				STYLES.container,
				animatedStyle,
				{
					backgroundColor: isSelected(item.value) ? '#a78bfa49' : '#f8f4f4',
					borderColor: isSelected(item.value) ? Colors.primary : '#d0d0d0',
					height: !item.image ? 'auto' : 220
				}
			]}
			onPress={handlePress(item.value)}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			key={item.id}
		>
			<Animated.View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column-reverse',
					rowGap: 8
				}}
			>
				<Animated.Text
					style={{
						color: isSelected(item.value) ? Colors.primary : '#676767',
						fontSize: 12,
						fontWeight: '700',
						transitionDuration: 200,
						textAlign: 'center'
					}}
				>
					{item.label}
				</Animated.Text>

				{item?.image && (
					<Image
						contentFit='cover'
						source={item.image[selectedGender] ? item.image[selectedGender] : item.image}
						style={{ aspectRatio: 1, width: 150 }}
					/>
				)}
			</Animated.View>
		</AnimatedPressable>
	);
}

const STYLES = StyleSheet.create({
	container: {
		paddingVertical: 12,
		borderRadius: 20,
		borderWidth: 1,
		transitionDuration: 250,
		padding: 20,
		flexBasis: '48%',
		flexGrow: 1,
		justifyContent: 'center'
	}
});
