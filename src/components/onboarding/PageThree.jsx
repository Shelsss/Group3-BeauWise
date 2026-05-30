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
import { useEffect } from 'react';
import Sparks from '../icons/Sparks';
import Colors from '@/constants/Colors';
import ShieldCheck from '../icons/hugeicons/ShieldCheck';
import CalendarCheck from '../icons/hugeicons/CalendarCheck';
import Check from '../icons/hugeicons/Check';
import Clock from '../icons/hugeicons/Clock';

const Card = ({ children }) => {
	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#fff',
				zIndex: 2,

				shadowColor: '#0000006a',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.2,
				shadowRadius: 1.41,

				elevation: 2,
				paddingVertical: 28,
				paddingHorizontal: 30,
				borderRadius: 14
			}}
		>
			{children}

			<View style={{ rowGap: 2, alignItems: 'center', marginTop: 6 }}>
				<View
					style={{ width: 30, height: 4, backgroundColor: '#33415525', borderRadius: 40 }}
				/>
				<View
					style={{ width: 20, height: 4, backgroundColor: '#33415525', borderRadius: 40 }}
				/>
			</View>
		</View>
	);
};

export default function PageThree({ isActive }) {
	const scale = useSharedValue(0);

	const cardOneY = useSharedValue(70);
	const cardTwoY = useSharedValue(80);

	const mainAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		};
	});

	const cardOneAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotateZ: '-6deg' },
				{ translateY: cardOneY.value },
				{ translateX: -12 }
			]
		};
	});

	const cardTwoAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotateZ: '8deg' },
				{ translateY: cardTwoY.value },
				{ translateX: 120 }
			]
		};
	});

	const triggerScale = () => {
		scale.value = withSpring(1, { duration: 800 });
	};

	const triggerFloat = () => {
		cardOneY.value = withRepeat(
			withSequence(
				withTiming(70, { duration: 1200 }),
				withTiming(60, { duration: 1200 })
			),
			-1,
			true
		);

		cardTwoY.value = withRepeat(
			withSequence(
				withTiming(80, { duration: 1200 }),
				withTiming(70, { duration: 1200 })
			),
			-1,
			true
		);
	};

	useEffect(() => {
		if (!isActive) return;

		triggerScale();
		triggerFloat();
	}, [isActive]);

	return (
		<View style={{ position: 'relative', backgroundColor: 'red', marginBottom: 260 }}>
			<Animated.View
				style={[
					{
						position: 'absolute',
						alignSelf: 'center',
						borderRadius: 100,
						top: -20,
						aspectRatio: 1,
						width: 190,
						backgroundColor: Colors.backgroundColor,
						shadowColor: Colors.primary,
						shadowOffset: {
							width: 0,
							height: 1
						},
						shadowOpacity: 0.2,
						shadowRadius: 1.41,

						elevation: 2,
						paddingVertical: 10,
						paddingHorizontal: 16
					},
					mainAnimatedStyle
				]}
			>
				<Animated.View
					style={[
						{
							position: 'absolute'
						},
						cardOneAnimatedStyle
					]}
				>
					<Card>
						<ShieldCheck size={30} color={Colors.primary} />
						<View style={{ position: 'absolute', top: 0, right: 0 }}>
							<Check color={Colors.primary} size={14} />
						</View>
					</Card>
				</Animated.View>

				<Animated.View
					style={[
						{
							position: 'absolute'
						},
						cardTwoAnimatedStyle
					]}
				>
					<Card>
						<CalendarCheck size={30} color={Colors.secondary} />
						<View style={{ bottom: 0, position: 'absolute', left: 0 }}>
							<Clock size={14} color={Colors.secondary} />
						</View>
					</Card>
				</Animated.View>
			</Animated.View>
		</View>
	);
}
