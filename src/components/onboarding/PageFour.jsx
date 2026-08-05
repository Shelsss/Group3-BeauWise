import { Text, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
	withTiming
} from 'react-native-reanimated';
import { useEffect } from 'react';
import BookOnboarding from '../icons/hugeicons/BookOnboarding';
import BulbOnboarding from '../icons/hugeicons/BulbOnboarding';

export default function PageFour({ isActive }) {
	const bookOpacity = useSharedValue(0);
	const bulbY = useSharedValue(-90);
	const bulbOpacity = useSharedValue(0);

	const bookAnimated = useAnimatedStyle(() => {
		return {
			opacity: bookOpacity.value
		};
	});

	const bulbAnimated = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: bulbY.value }],
			opacity: bulbOpacity.value
		};
	});

	const triggerBook = () => {
		bookOpacity.value = withTiming(1, { duration: 800 });
	};

	const triggerBulb = () => {
		bulbOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
		bulbY.value = withDelay(
			800,
			withSequence(
				withSpring(-100, { mass: 2, duration: 200, damping: 2 }),
				withSpring(-90, { mass: 6, duration: 100, stiffness: 2 })
			)
		);
	};

	useEffect(() => {
		if (!isActive) return;

		triggerBook();
		triggerBulb();
	}, [isActive]);

	return (
		<View style={{ position: 'relative', marginBottom: 120 }}>
			<Animated.View
				style={[
					{
						position: 'absolute',
						alignSelf: 'center'
					},
					bulbAnimated
				]}
			>
				<BulbOnboarding size={200} />
			</Animated.View>
			<Animated.View
				style={[{ position: 'absolute', alignSelf: 'center' }, bookAnimated]}
			>
				<BookOnboarding size={200} />
			</Animated.View>
		</View>
	);
}
