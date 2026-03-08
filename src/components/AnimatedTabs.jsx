import { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';
import Colors from '../constants/Colors';

export default function AnimatedTabs({
	tabs = [],
	currentIndex = 0,
	handleTabChange,
	activeColor = Colors.primary,
	inactiveColor = '#9a9a9a',
	style
}) {
	const [tabLayouts, setTabLayouts] = useState([]);
	const allMeasured = tabLayouts.length === tabs.length && tabLayouts.every(Boolean);

	const indicatorX = useSharedValue(0);
	const indicatorWidth = useSharedValue(0);

	useEffect(() => {
		if (!allMeasured) return;
		const active = tabLayouts[currentIndex];
		if (!active) return;

		indicatorX.value = withTiming(active.x);
		indicatorWidth.value = withTiming(active.width);
	}, [allMeasured, currentIndex, tabLayouts, indicatorWidth, indicatorX]);

	const handleTabLayout = useCallback(
		(index) => (e) => {
			const { x, width } = e.nativeEvent.layout;
			setTabLayouts((prev) => {
				const next = [...prev];
				next[index] = { x, width };
				return next;
			});
		},
		[]
	);

	const handlePress = useCallback(
		(index) => () => {
			if (index === currentIndex) return;

			handleTabChange(index);
		},
		[currentIndex, handleTabChange]
	);

	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: indicatorX.value }],
		width: indicatorWidth.value
	}));

	return (
		<View style={style}>
			<View style={{ flexDirection: 'row' }}>
				{tabs.map((label, index) => {
					const isActive = index === currentIndex;

					return (
						<TouchableOpacity
							key={label}
							onLayout={handleTabLayout(index)}
							onPress={handlePress(index)}
							style={{
								flex: 1,
								paddingVertical: 12,
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Animated.Text
								style={{
									fontSize: 14,
									fontWeight: '700',
									color: isActive ? '#191919' : inactiveColor,
									transitionDuration: 200
								}}
							>
								{label}
							</Animated.Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<Animated.View
				style={[
					{
						position: 'absolute',
						bottom: 0,
						height: 2,
						borderRadius: 10,
						backgroundColor: activeColor
					},
					indicatorStyle
				]}
			/>
		</View>
	);
}
