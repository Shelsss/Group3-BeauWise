import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Animated, {
	BounceIn,
	BounceOut,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { useProfilingStore } from '@/stores/useProfilingStore';
import { scheduleOnRN } from 'react-native-worklets';
import { useDebouncedCallback } from 'use-debounce';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import Check from '../icons/hugeicons/Check';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OptionItem({
	activeTheme,
	item,
	isSelected,
	handlePress,
	selectedGender
}) {
	const setShowProfileZoom = useProfilingStore((state) => state.setShowProfileZoom);
	const setImageZoomSrc = useProfilingStore((state) => state.setImageZoomSrc);
	const scale = useSharedValue(1);

	const debouncedZoom = useDebouncedCallback(() => {
		setShowProfileZoom(true);
	}, 300);

	const longPressGesture = Gesture.LongPress().onStart(() => {
		let src = item.image;

		scheduleOnRN(setImageZoomSrc, {
			label: item.label,
			src,
			description: item.description
		});
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
						borderWidth: 1,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderColor: isSelected(item.value)
							? styles.theme.colors.primary
							: styles.theme.colors[activeTheme].card_border,
						height: !item.image ? 'auto' : item?.description ? 250 : 220
					}
				]}
				onPress={handlePress(item.value)}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				key={item.id}
			>
				{isSelected(item.value) && (
					<Animated.View
						entering={BounceIn.damping(180)}
						exiting={FadeOut.duration(120)}
						style={{
							position: 'absolute',
							top: 14,
							right: 14,
							zIndex: 2
						}}
					>
						<Check size={styles.icon.size.xl} color={styles.theme.colors.status.green} />
					</Animated.View>
				)}

				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column-reverse',
						rowGap: 8
					}}
				>
					{item?.description && (
						<Animated.Text
							style={{
								position: 'absolute',
								bottom: -40,
								zIndex: 1,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text_secondary + '9a',
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.semi_bold,
								transitionDuration: 320,
								textAlign: 'center'
							}}
						>
							{item.description}
						</Animated.Text>
					)}

					<Animated.Text
						style={{
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text,
							fontSize: styles.font.size.sm,
							fontWeight: '500',
							transitionDuration: 320,
							textAlign: 'center'
						}}
					>
						{item.label}
					</Animated.Text>

					{item?.image && (
						<Image
							contentFit='cover'
							source={item.image}
							style={{ aspectRatio: 1, width: 100 }}
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
		borderRadius: styles.border.radius.size.lg,
		transitionDuration: 250,
		padding: styles.spacing.double_xl,
		flexBasis: '48%',
		flexGrow: 1,
		justifyContent: 'center'
	}
});
