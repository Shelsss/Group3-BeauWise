import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming
} from 'react-native-reanimated';

const Skeleton = ({ width, height, borderRadius = 4, style }) => {
	const opacity = useSharedValue(0.3);

	useEffect(() => {
		opacity.value = withRepeat(withTiming(0.8, { duration: 200 }), -1, true);
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		};
	});

	return (
		<Animated.View
			style={[styles.skeleton, { width, height, borderRadius }, animatedStyle, style]}
		/>
	);
};

const styles = StyleSheet.create({
	skeleton: {
		backgroundColor: '#E0E0E0'
	}
});

export default Skeleton;
