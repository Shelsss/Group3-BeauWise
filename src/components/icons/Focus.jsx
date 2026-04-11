import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedProps,
	withSpring,
	withRepeat,
	withTiming,
	FadeIn,
	FadeOut
} from 'react-native-reanimated';
import { usePointStore } from '@/stores/usePointStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FocusRing({ targetX, targetY, isActive = true }) {
	const point = usePointStore((state) => state.point);
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	useEffect(() => {
		if (isActive) {
			translateX.value = withSpring(point.x, { damping: 15 });
			translateY.value = withSpring(point.y, { damping: 15 });
		}
	}, [targetX, targetY, isActive]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value - 50 },
			{ translateY: translateY.value - 50 }
		]
	}));

	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut.duration(300)}
			style={[styles.container]}
		>
			<Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} viewBox='0 0 30 30'>
				<Path d='M13 3.182A12.01 12.01 0 0 0 3.182 13h2.017A9.99 9.99 0 0 1 13 5.2Zm4 0v2.017A9.99 9.99 0 0 1 24.8 13h2.018A12.01 12.01 0 0 0 17 3.182M3.182 17A12.01 12.01 0 0 0 13 26.818v-2.017A9.99 9.99 0 0 1 5.2 17ZM24.8 17a9.99 9.99 0 0 1-7.8 7.8v2.018A12.01 12.01 0 0 0 26.818 17Z' />
			</Svg>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 10
	}
});
