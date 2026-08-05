import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	interpolate
} from 'react-native-reanimated';
import { useThemeStore } from '@/stores/useThemeStore';

const backgroundLight = '#efefef';
const backgroundDark = '#172138';
const gradientLight = ['#f1f1f1', '#f4f4f4'];
const gradientDark = ['#162038', '#141e36'];

export default function Skeleton({ width, height, borderRadius = 4, style }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const shimmerProgress = useSharedValue(0);

	const layoutWidth = useSharedValue(0);
	useEffect(() => {
		shimmerProgress.value = withRepeat(withTiming(1, { duration: 800 }), -1, false);
	}, [shimmerProgress]);

	const animatedStyle = useAnimatedStyle(() => {
		const translateX = interpolate(
			shimmerProgress.value,
			[0, 1],
			[-layoutWidth.value, layoutWidth.value]
		);

		return {
			transform: [{ translateX }]
		};
	});

	return (
		<View
			style={[
				{ width, height, borderRadius, overflow: 'hidden' },
				style,
				{
					backgroundColor: activeTheme === 'light' ? backgroundLight : backgroundDark
				}
			]}
			onLayout={(e) => layoutWidth.set(e.nativeEvent.layout.width)}
		>
			<Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
				<LinearGradient
					colors={activeTheme === 'light' ? gradientLight : gradientDark}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={[StyleSheet.absoluteFillObject, { borderRadius }]}
				/>
			</Animated.View>
		</View>
	);
}
