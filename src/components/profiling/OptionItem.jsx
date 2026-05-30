import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { useProfilingStore } from '@/stores/useProfilingStore';
import { scheduleOnRN } from 'react-native-worklets';
import { useDebouncedCallback } from 'use-debounce';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OptionItem({ item, isSelected, handlePress, selectedGender }) {
	const setShowProfileZoom = useProfilingStore((state) => state.setShowProfileZoom);
	const setImageZoomSrc = useProfilingStore((state) => state.setImageZoomSrc);
	const scale = useSharedValue(1);

	const debouncedZoom = useDebouncedCallback(() => {
		setShowProfileZoom(true);
	}, 300);

	const longPressGesture = Gesture.LongPress().onStart(() => {
		let src = item.image;

		scheduleOnRN(setImageZoomSrc, { label: item.label, src });
		scheduleOnRN(debouncedZoom);
	});

	const springConfig = {
		mass: 0.5,
		damping: 8,
		stiffness: 500
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		};
	});

	const handlePressIn = () => {
		scale.value = withSpring(0.97, springConfig);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, springConfig);
	};

	return (
		<GestureDetector gesture={longPressGesture}>
			<AnimatedPressable
				style={[
					STYLES.container,
					animatedStyle,
					{
						backgroundColor: isSelected(item.value)
							? Colors.primary + '2a'
							: 'transparent',
						borderColor: isSelected(item.value) ? Colors.primary : '#d0d0d0',
						height: !item.image ? 'auto' : 220
					}
				]}
				onPress={handlePress(item.value)}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				key={item.id}
			>
				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column-reverse',
						rowGap: 8
					}}
				>
					<Animated.Text
						style={{
							fontFamily: 'Outfit',
							color: isSelected(item.value) ? Colors.primary : '#676767',
							fontSize: 12,
							fontWeight: '500',
							transitionDuration: 200,
							textAlign: 'center'
						}}
					>
						{item.label}
					</Animated.Text>

					{item?.image && (
						<Image
							contentFit='cover'
							source={item.image}
							style={{ aspectRatio: 1, width: 150 }}
						/>
					)}
				</Animated.View>
			</AnimatedPressable>
		</GestureDetector>
	);
}

const STYLES = StyleSheet.create({
	container: {
		paddingVertical: 12,
		borderRadius: 20,
		borderWidth: 1,
		transitionDuration: 250,
		padding: 20,
		flexBasis: '48%',
		flexGrow: 1,
		justifyContent: 'center'
	}
});
