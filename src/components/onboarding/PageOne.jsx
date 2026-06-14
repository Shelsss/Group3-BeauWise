import { Text, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withSpring,
	withTiming
} from 'react-native-reanimated';
import Magnify from '@/components/icons/Magnify';
import ClipboardOnboarding from '@/components/icons/ClipboardOnboarding';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect } from 'react';
import Sparks from '../icons/Sparks';
import Colors from '@/constants/Colors';

export default function PageOne({ isActive }) {
	const magnifyOpacity = useSharedValue(0);
	const clipboardOpacity = useSharedValue(0);
	const magnifyX = useSharedValue(40);
	const magnifyY = useSharedValue(-60);

	const sparkY = useSharedValue(0);

	const sparkTwoY = useSharedValue(0);
	const magnifyAnimated = useAnimatedStyle(() => {
		return {
			opacity: magnifyOpacity.value,
			transform: [{ translateX: magnifyX.value }, { translateY: magnifyY.value }]
		};
	});

	const clipBoardAnimated = useAnimatedStyle(() => {
		return {
			opacity: clipboardOpacity.value
		};
	});

	const sparkAnimated = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: sparkY.value }]
		};
	});

	const sparkTwoAnimated = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: sparkTwoY.value }]
		};
	});

	const triggerMagnify = () => {
		magnifyOpacity.value = withDelay(200, withTiming(1, { duration: 200 }));
		magnifyX.value = magnifyX.value = withSequence(
			withDelay(100, withSpring(-14, { duration: 1200 })),
			withDelay(120, withSpring(40, { duration: 1200 })),
			withDelay(120, withSpring(2, { duration: 1200 }))
		);

		magnifyY.value = withSequence(
			withDelay(180, withSpring(10, { duration: 1200 })),
			withDelay(120, withSpring(-50, { duration: 1200 })),

			withDelay(120, withSpring(-40, { duration: 1200 }))
		);
	};

	const triggerSparks = () => {
		sparkY.value = withRepeat(
			withSequence(
				withTiming(-38, { duration: 1100 }),
				withTiming(-32, { duration: 1100 })
			),
			-1,
			true
		);

		sparkTwoY.value = withRepeat(
			withSequence(
				withTiming(100, { duration: 1100 }),
				withTiming(90, { duration: 1100 })
			),
			-1,
			true
		);
	};

	const triggerClipboard = () => {
		clipboardOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
	};

	useEffect(() => {
		triggerClipboard();
		triggerMagnify();
		triggerSparks();
	}, []);

	return (
		<View style={{ position: 'relative', backgroundColor: 'red', marginBottom: 200 }}>
			<Animated.View>
				<Animated.View
					style={[
						{ position: 'absolute', alignSelf: 'center', top: -120 },
						clipBoardAnimated
					]}
				>
					<ClipboardOnboarding size={320} />
				</Animated.View>

				<Animated.View
					style={[
						{
							position: 'absolute',
							alignSelf: 'center',
							right: -86,

							transform: [{ translateY: -40 }]
						},
						sparkAnimated
					]}
				>
					<Sparks size={20} color='#ffafa3' />
				</Animated.View>

				<Animated.View
					style={[
						{
							position: 'absolute',
							alignSelf: 'center',
							right: 80,

							transform: [{ translateY: 100 }]
						},
						sparkTwoAnimated
					]}
				>
					<Sparks size={12} color={Colors.primary} />
				</Animated.View>
			</Animated.View>

			<Animated.View
				style={[
					{
						position: 'absolute',
						alignSelf: 'center',
						transform: [{ translateY: -60 }, { translateX: 40 }]
					},
					magnifyAnimated
				]}
			>
				<Magnify size={200} />
			</Animated.View>
		</View>
	);
}
