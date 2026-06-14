import { Text, TouchableOpacity, View } from 'react-native';
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

const Badge = ({ color, text }) => {
	return (
		<View
			style={{
				borderRadius: 10,
				alignItems: 'center',
				flexDirection: 'row',
				columnGap: 6,
				backgroundColor: '#fff',

				shadowColor: '#00000075',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.2,
				shadowRadius: 1.41,

				elevation: 2,
				paddingVertical: 10,
				paddingHorizontal: 16
			}}
		>
			<View
				style={{ aspectRatio: 1, width: 6, backgroundColor: color, borderRadius: 50 }}
			/>
			<Text style={{ fontFamily: 'Outfit', fontSize: 12 }}>{text}</Text>
		</View>
	);
};
export default function PageTwo({ isActive }) {
	const lineOneWidth = useSharedValue(0);

	const lineTwoWidth = useSharedValue(0);
	const lineThreeWidth = useSharedValue(0);
	const lineFourWidth = useSharedValue(0);
	const lineFiveWidth = useSharedValue(0);
	const lineSixthWidth = useSharedValue(0);

	const badgeOneScale = useSharedValue(0);
	const badgeTwoScale = useSharedValue(0);
	const badgeThreeScale = useSharedValue(0);

	const badgeOneY = useSharedValue(-170);
	const badgeTwoY = useSharedValue(-30);
	const badgeThreeY = useSharedValue(-80);

	const lineOneAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineOneWidth.value
		};
	});

	const lineTwoAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineTwoWidth.value
		};
	});

	const lineThreeAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineThreeWidth.value
		};
	});

	const lineFourAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineFourWidth.value
		};
	});

	const lineFiveAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineFiveWidth.value
		};
	});

	const lineSixthAnimatedStyle = useAnimatedStyle(() => {
		return {
			width: lineSixthWidth.value
		};
	});

	const badgeOneAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ scale: badgeOneScale.value },
				{ translateY: badgeOneY.value },
				{ translateX: 100 },
				{ rotateZ: '4deg' }
			]
		};
	});

	const badgeTwoAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ scale: badgeTwoScale.value },
				{ rotateZ: '2deg' },
				{ translateX: 60 },
				{ translateY: badgeTwoY.value }
			]
		};
	});

	const badgeThreeAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ scale: badgeThreeScale.value },
				{ rotateZ: '-4deg' },
				{ translateX: -96 },

				{ translateY: badgeThreeY.value }
			]
		};
	});

	const triggerLine = () => {
		lineOneWidth.value = withDelay(200, withTiming(50, { duration: 1500 }));

		lineTwoWidth.value = withDelay(300, withTiming(130, { duration: 1500 }));
		lineThreeWidth.value = withDelay(320, withTiming(90, { duration: 1500 }));
		lineFourWidth.value = withDelay(340, withTiming(120, { duration: 1500 }));
		lineFiveWidth.value = withDelay(360, withTiming(138, { duration: 1500 }));
		lineSixthWidth.value = withDelay(380, withTiming(78, { duration: 1500 }));
	};

	const triggerBadge = () => {
		badgeOneScale.value = withDelay(
			200,
			withSpring(1, {
				damping: 100,
				stiffness: 700,
				mass: 2,
				duration: 700
			})
		);

		badgeTwoScale.value = withDelay(
			600,
			withSpring(1, {
				damping: 100,
				stiffness: 700,
				mass: 2,
				duration: 700
			})
		);

		badgeThreeScale.value = withDelay(
			400,
			withSpring(1, {
				damping: 100,
				stiffness: 700,
				mass: 2,
				duration: 700
			})
		);

		badgeOneY.value = withDelay(
			200,
			withRepeat(
				withSequence(
					withTiming(-160, { duration: 1200 }),
					withTiming(-170, { duration: 1200 })
				),
				-1,
				true
			)
		);

		badgeTwoY.value = withDelay(
			400,
			withRepeat(
				withSequence(
					withTiming(-20, { duration: 1200 }),
					withTiming(-30, { duration: 1200 })
				),
				-1,
				true
			)
		);

		badgeThreeY.value = withDelay(
			600,
			withRepeat(
				withSequence(
					withTiming(-70, { duration: 1200 }),
					withTiming(-80, { duration: 1200 })
				),
				-1,
				true
			)
		);
	};
	useEffect(() => {
		if (!isActive) return;

		triggerLine();
		triggerBadge();
	}, [isActive]);

	return (
		<>
			<Animated.View
				style={[
					{
						zIndex: 2,
						position: 'absolute',
						transform: [{ translateY: -180 }, { translateX: 100 }]
					},
					badgeOneAnimatedStyle
				]}
			>
				<Badge text={'Aloe Vera'} color='#4ADE80' />
			</Animated.View>

			<Animated.View
				style={[
					{
						zIndex: 2,
						position: 'absolute'
					},
					badgeTwoAnimatedStyle
				]}
			>
				<Badge text={'Glycerin'} color={Colors.primary} />
			</Animated.View>

			<Animated.View
				style={[
					{
						zIndex: 2,
						position: 'absolute'
					},
					badgeThreeAnimatedStyle
				]}
			>
				<Badge text={'Retinol'} color={Colors.secondary} />
			</Animated.View>

			<View style={{ marginBottom: 280 }}>
				<View
					style={{
						borderRadius: 28,
						width: 200,
						height: 260,
						position: 'absolute',
						alignSelf: 'center',

						top: -50,
						borderWidth: 3.5,
						borderColor: '#dfdfdf',
						overflow: 'hidden'
					}}
				>
					<View style={{ backgroundColor: Colors.primary, width: '100%', height: 2.5 }} />

					<View style={{ paddingVertical: 20, paddingHorizontal: 20, rowGap: 20 }}>
						<Animated.View
							style={[
								{
									width: 50,
									height: 16,
									borderRadius: 40,
									backgroundColor: '#33415534'
								},
								lineOneAnimatedStyle
							]}
						/>

						<View style={{ rowGap: 6 }}>
							<Animated.View
								style={[
									{
										width: 130,
										backgroundColor: '#33415534',
										height: 6,

										borderRadius: 40
									},
									lineTwoAnimatedStyle
								]}
							/>

							<Animated.View
								style={[
									{
										width: 90,
										backgroundColor: '#33415534',
										height: 6,

										borderRadius: 40
									},
									lineThreeAnimatedStyle
								]}
							/>

							<Animated.View
								style={[
									{
										width: 120,
										backgroundColor: '#33415534',
										height: 6,

										borderRadius: 40
									},
									lineFourAnimatedStyle
								]}
							/>

							<Animated.View
								style={[
									{
										width: 138,
										backgroundColor: '#33415534',
										height: 6,

										borderRadius: 40
									},
									lineFiveAnimatedStyle
								]}
							/>

							<Animated.View
								style={[
									{
										width: 78,
										backgroundColor: '#33415534',
										height: 6,

										borderRadius: 40
									},
									lineSixthAnimatedStyle
								]}
							/>
						</View>
					</View>
				</View>
			</View>
		</>
	);
}
