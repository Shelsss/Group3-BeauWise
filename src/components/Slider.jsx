import styles from '@/config/styles';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SLIDER_WIDTH = '100%';
const KNOB_SIZE = 20;

export default function Slider({ labels, activeTheme, onValueChange, currentIndex }) {
	// const [selectedIndex, setSelectedIndex] = useState(currentIndex);
	const [steps, setSteps] = useState({});
	const [width, setWidth] = useState(0);

	const MAX_TRANSLATE_X = Math.max(0, width - KNOB_SIZE);
	const stepWidth = MAX_TRANSLATE_X / (labels.length - 1);

	const translateX = useSharedValue(currentIndex === -1 ? 0 : currentIndex);
	const contextX = useSharedValue(0);
	const panGesture = Gesture.Pan()
		.onStart(() => {
			contextX.value = translateX.value;
		})
		.onUpdate((event) => {
			const rawTranslateX = contextX.value + event.translationX;

			let currentStep = Math.round(rawTranslateX / stepWidth);

			currentStep = Math.max(0, Math.min(currentStep, labels.length - 1));

			const snappedTranslateX = currentStep * stepWidth;

			translateX.value = snappedTranslateX;

			scheduleOnRN(onValueChange, currentStep);
		});

	const animatedKnobStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }]
		};
	});

	const animatedProgressStyle = useAnimatedStyle(() => {
		return {
			width: translateX.value + KNOB_SIZE / 2
		};
	});

	const onIndexChange = (index) => () => {
		translateX.value = withSpring(steps[index].range, { damping: 90 });

		onValueChange(index);
	};

	useEffect(() => {
		const index = currentIndex === -1 ? 0 : currentIndex;
		const previousIndex = index * stepWidth;

		translateX.value = withSpring(previousIndex, { damping: 90 });
	}, [currentIndex, stepWidth]);

	return (
		<View
			onLayout={(e) => {
				const { width } = e.nativeEvent.layout;

				setWidth(width);
			}}
			style={STYLES.sliderContainer}
		>
			<View style={STYLES.track} />

			<Animated.View style={[STYLES.progressTrack, animatedProgressStyle]} />

			<View
				style={{
					position: 'absolute',
					bottom: -8,
					flexDirection: 'row',

					width: width
				}}
			>
				{labels.map((label, index) => {
					const lastItem = index === labels.length - 1;

					return (
						<View
							key={label}
							style={{
								top: -40,

								zIndex: 0,
								flex: lastItem ? 0.2 : 1
							}}
						>
							<Pressable
								onPress={onIndexChange(index)}
								style={{
									padding: 10,
									position: 'absolute',
									backgroundColor: 'red',
									opacity: 0
								}}
							/>
						</View>
					);
				})}
			</View>

			<View
				style={{
					position: 'absolute',
					bottom: -8,
					flexDirection: 'row',

					width: width
				}}
			>
				{labels.map((label, index) => {
					const lastItem = index === labels.length - 1;

					return (
						<View
							onLayout={(e) => {
								const { x } = e.nativeEvent.layout;

								setSteps((prev) => {
									return {
										...prev,
										[index]: {
											range: x
										}
									};
								});
							}}
							key={label}
							style={{
								flex: lastItem ? 0.2 : 1
							}}
						>
							<TouchableOpacity
								onPress={onIndexChange(index)}
								style={{ position: 'absolute' }}
							>
								<Animated.Text
									style={{
										fontSize: styles.font.size.xs + 1.4,
										fontFamily: styles.font.family,
										fontWeight:
											currentIndex === index
												? styles.font.weight.bold
												: styles.font.weight.regular,
										color:
											currentIndex === index
												? styles.theme.colors.primary
												: styles.theme.colors[activeTheme].text,
										transitionDuration: 240
									}}
								>
									{label}
								</Animated.Text>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[STYLES.knob, animatedKnobStyle]} />
			</GestureDetector>
		</View>
	);
}

const STYLES = StyleSheet.create({
	sliderContainer: {
		width: SLIDER_WIDTH,
		height: 40,
		justifyContent: 'center'
	},
	track: {
		position: 'absolute',
		width: SLIDER_WIDTH,
		height: 6,
		backgroundColor: '#d3d3d3',
		borderRadius: 3
	},
	progressTrack: {
		position: 'absolute',
		height: 6,
		backgroundColor: styles.theme.colors.primary,
		borderRadius: 3
	},
	knob: {
		position: 'absolute',
		width: KNOB_SIZE,
		height: KNOB_SIZE,
		backgroundColor: '#ffffff',
		borderRadius: KNOB_SIZE / 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3
	}
});
