import React, { useEffect } from 'react';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withRepeat
} from 'react-native-reanimated';

export default function InfiniteFade({ children }) {
	const opacity = useSharedValue(0);

	useEffect(() => {
		opacity.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value
	}));

	return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
