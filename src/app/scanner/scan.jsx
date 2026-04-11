import React, { useRef, useState } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	Vibration,
	View
} from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withDelay,
	createAnimatedComponent
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useDebouncedCallback } from 'use-debounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagePadding from '@/constants/PagePadding';
import { ArrowLeft, CircleQuestionMark } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Image } from 'expo-image';
import { saveToLibraryAsync } from 'expo-media-library';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { ImageManipulator } from 'expo-image-manipulator';
import { scanIngredient } from '@/services/cloudFunctions';
import { useScanStore } from '@/stores/useScanStore';
const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);
export default function CameraScreen() {
	const setImageBase64 = useScanStore((state) => state.setImageBase64);
	const [frameData, setFrameData] = useState(() => ({
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}));

	const [cameraFrameData, setCameraFrameData] = useState(() => ({
		width: 0,
		height: 0
	}));

	const { top } = useSafeAreaInsets();
	const cameraRef = useRef(null);
	const device = useCameraDevice('back');

	const appState = useAppState();
	const isFocus = useIsFocused();
	const isActive = isFocus && appState === 'active';
	const ringX = useSharedValue(0);
	const ringY = useSharedValue(0);
	const ringOpacity = useSharedValue(0);
	const ringScale = useSharedValue(1.5);

	const ringChildScale = useSharedValue(0);
	const ringChildOpacity = useSharedValue(0);

	const shutterScale = useSharedValue(1);
	const shutteredView = useSharedValue(0);

	const imageEntry = useSharedValue(0);

	const animatedImageEntry = useAnimatedStyle(() => {
		return {
			opacity: imageEntry.value
		};
	});

	const showImage = () => {
		imageEntry.value = 0;
		imageEntry.value = withTiming(1, { duration: 200 });
	};

	const [photo, setPhoto] = useState(null);
	const handleCapturePhoto = async () => {
		const capturedImage = await cameraRef.current.takePhoto();
		shutteredView.value = 1;
		shutteredView.value = withDelay(100, withTiming(0));
		Vibration.vibrate(50);
		const croppedImage = await cropImage(
			capturedImage,
			frameData,
			cameraFrameData.width,
			cameraFrameData.height
		);

		setImageBase64(croppedImage.base64);
		router.push({
			pathname: 'scanner/processing'
		});

		// await saveToLibraryAsync(croppedImage.uri);
	};

	const handleFrameLayout = (event) => {
		const { x, y, width, height } = event.nativeEvent.layout;
		setFrameData({ x, y, width, height });
	};

	const focusCamera = useDebouncedCallback(async (x, y) => {
		if (device?.supportsFocus) {
			cameraRef.current?.focus({ x, y });
		}
	}, 400);

	const tapToFocus = Gesture.Tap().onEnd(({ x, y, absoluteX, absoluteY }) => {
		scheduleOnRN(focusCamera, x, y);

		ringX.value = x - 30;
		ringY.value = y - 30;

		ringOpacity.value = 1;
		ringChildOpacity.value = 1;

		ringChildScale.value = 0.2;
		ringScale.value = 1.5;

		ringChildScale.value = withTiming(1.14, { duration: 300 });
		ringScale.value = withTiming(1, { duration: 200 });

		ringOpacity.value = withDelay(800, withTiming(0, { duration: 1100 }));
		ringChildOpacity.value = withDelay(200, withTiming(0, { duration: 700 }));
	});

	const focusRingStyle = useAnimatedStyle(() => {
		return {
			top: ringY.value,
			left: ringX.value,
			opacity: ringOpacity.value,
			transform: [{ scale: ringScale.value }]
		};
	});

	const focusRingChildStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: ringChildScale.value }],
			opacity: ringChildOpacity.value
		};
	});

	const shutterButtonAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: shutterScale?.value }]
		};
	});

	const shutteredViewIndicator = useAnimatedStyle(() => {
		return {
			opacity: shutteredView.value
		};
	});

	if (device == null) return <View style={styles.container} />;
	return (
		<View
			style={styles.container}
			onLayout={({
				nativeEvent: {
					layout: { x, y, width, height }
				}
			}) => {
				setCameraFrameData({ width, height });
			}}
		>
			<View
				style={{
					flex: 1,
					zIndex: 1,
					paddingTop: top + 20,
					paddingHorizontal: PagePadding.config.paddingHorizontal
				}}
			>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.button}
						activeOpacity={0.9}
					>
						<ArrowLeft size={20} color={'#fff'} />
					</TouchableOpacity>

					<View style={{ alignItems: 'center' }}>
						<Text style={{ fontWeight: 500, letterSpacing: 1.4, color: '#fff' }}>
							SCAN LABEL
						</Text>
						<Text style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>
							Ingredient Analysis
						</Text>
					</View>

					<TouchableOpacity style={[styles.button]} activeOpacity={0.9}>
						<CircleQuestionMark size={20} color={'#fff'} />
					</TouchableOpacity>
				</View>

				<View
					onLayout={handleFrameLayout}
					style={{
						position: 'relative',
						pointerEvents: 'none',
						borderRadius: 24,
						marginTop: 20,
						aspectRatio: 3 / 4,
						width: '100%',

						alignSelf: 'center',
						borderColor: '#efefef',
						borderWidth: 1,
						overflow: 'hidden'
					}}
				>
					<Animated.View
						style={[{ flex: 1, backgroundColor: '#1c1c1c23' }, shutteredViewIndicator]}
					/>

					<View style={[styles.frameCornerStyle, styles.frameTopLeft]} />
					<View style={[styles.frameCornerStyle, styles.frameTopRight]} />
					<View style={[styles.frameCornerStyle, styles.frameBottomLeft]} />
					<View style={[styles.frameCornerStyle, styles.frameBottomRight]} />
				</View>

				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flex: 1,
						backgroundColor: 'transparent'
					}}
				>
					<View
						style={{
							borderColor: '#efefefd8',
							borderWidth: 1,
							padding: 4,
							borderRadius: 100,
							overflow: 'hidden'
						}}
					>
						<AnimatedTouchableOpacity
							onPressIn={() => {
								shutterScale.value = 0.95;
							}}
							onPressOut={() => {
								shutterScale.value = 1;
							}}
							onPress={handleCapturePhoto}
							activeOpacity={0.7}
							style={[
								{ backgroundColor: '#fff', padding: '10%', borderRadius: 100 },
								shutterButtonAnimatedStyle
							]}
						/>
					</View>
				</View>
			</View>
			<GestureDetector gesture={tapToFocus}>
				<Camera
					preview
					photoHdr={true}
					photoQualityBalance='quality'
					ref={cameraRef}
					style={StyleSheet.absoluteFill}
					device={device}
					isActive={isActive}
					photo={true}
					outputOrientation='preview'
					androidPreviewViewType='surface-view'
				/>
			</GestureDetector>

			{photo && (
				<Animated.View
					style={[
						{
							top: 200,
							left: 100,

							position: 'absolute'
						},
						animatedImageEntry
					]}
				>
					<Image source={{ uri: photo }} style={StyleSheet.absoluteFill} />
				</Animated.View>
			)}

			<Animated.View pointerEvents='none' style={[styles.focusRing, focusRingStyle]}>
				<Animated.View
					pointerEvents='none'
					style={[
						{
							backgroundColor: '#efefef2f',
							borderRadius: 30,
							width: 60,
							height: 60
						},
						focusRingChildStyle
					]}
				/>
			</Animated.View>
		</View>
	);
}

async function cropImage(capturedImage, frameData, viewPortWidth, viewPortHeight) {
	const widthFactor = capturedImage.width / viewPortWidth;
	const heightFactor = capturedImage.height / viewPortHeight;

	const scaleFactor = Math.min(widthFactor, heightFactor);

	const scaleFactorWidth = viewPortWidth * scaleFactor;
	const scaleFactorHeight = viewPortHeight * scaleFactor;

	const offsetX = (capturedImage.width - scaleFactorWidth) / 2;
	const offsetY = (capturedImage.height - scaleFactorHeight) / 2;

	const frameScaleX = frameData.x * scaleFactor;
	const frameScaleY = frameData.y * scaleFactor;

	const cropX = frameScaleX + offsetX;
	const cropY = frameScaleY + offsetY;

	const cropWidth = frameData.width * scaleFactor;
	const cropHeight = frameData.height * scaleFactor;

	const croppedImage = await ImageManipulator.manipulate(`file:///${capturedImage.path}`)
		.crop({
			originX: cropX,
			originY: cropY,
			width: cropWidth,
			height: cropHeight
		})
		.renderAsync();

	return await croppedImage.saveAsync({
		base64: true
	});
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},

	button: {
		padding: 12,
		backgroundColor: '#3a3a3a',
		borderRadius: 100
	},
	focusRing: {
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 0.8,
		borderColor: '#efefef',
		backgroundColor: 'transparent'
	},

	frameCornerStyle: {
		width: '15%',

		position: 'absolute',
		aspectRatio: 1,
		borderWidth: 1.5,
		borderColor: Colors.primary,
		borderRadius: 12
	},

	frameTopLeft: {
		left: 8,
		top: 8,
		borderRightWidth: 0,
		borderBottomWidth: 0,
		borderBottomLeftRadius: 2,
		borderTopRightRadius: 2
	},

	frameTopRight: {
		right: 8,
		top: 8,
		borderLeftWidth: 0,
		borderBottomWidth: 0,
		borderBottomRightRadius: 2,
		borderTopLeftRadius: 2
	},

	frameBottomLeft: {
		bottom: 8,
		left: 8,
		borderRightWidth: 0,
		borderTopWidth: 0,
		borderBottomRightRadius: 2,
		borderTopLeftRadius: 2
	},

	frameBottomRight: {
		bottom: 8,
		right: 8,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		borderTopRightRadius: 2,
		borderBottomLeftRadius: 2
	}
});
