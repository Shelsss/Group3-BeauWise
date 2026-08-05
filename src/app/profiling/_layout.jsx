import AlbumImage from '@/components/icons/hugeicons/AlbumImage';
import ProfilingFooter from '@/components/profiling/ProfilingFooter';
import ProfilingHeader from '@/components/profiling/ProfilingHeader';
import styles from '@/config/styles';
import Questionnaire from '@/constants/Questionnaire';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Image } from 'expo-image';

import { router, Slot, useGlobalSearchParams, useSegments } from 'expo-router';
import LottieView from 'lottie-react-native';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { ResumableZoom } from 'react-native-zoom-toolkit';
import { useDebouncedCallback } from 'use-debounce';

const holdGesture = require('assets/lottie/touch-hold-gesture.json');
const holdGestureWhite = require('assets/lottie/touch-hold-gesture-white.json');
export default function ProfilingLayout() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const params = useGlobalSearchParams();
	const segments = useSegments();

	const isTransition = segments.includes('transition');
	const step = parseInt(params.step);

	const currentStep = isTransition
		? parseInt(params.nextStep) || 0
		: parseInt(params.step) || 0;

	const showProfileZoom = useProfilingStore((state) => state.showProfileZoom);
	const setShowProfileZoom = useProfilingStore((state) => state.setShowProfileZoom);

	const setSlideDirection = useProfilingStore((state) => state.setSlideDirection);

	const imageZoomSrc = useProfilingStore((state) => state.imageZoomSrc);
	const hideProfileZoom = () => setShowProfileZoom(!showProfileZoom);

	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const debounceShowModal = useDebouncedCallback(showModal, 280);

	useEffect(() => {
		const backAction = () => {
			setSlideDirection('backward');

			if (!router.canGoBack()) {
				return false;
			}

			router.back();
			return true;
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
	return (
		<>
			<ProfilingHeader
				setSlideDirection={setSlideDirection}
				isTransition={isTransition}
				currentStep={currentStep}
			/>
			<Slot />
			<ProfilingFooter
				isTransition={isTransition}
				showModal={debounceShowModal}
				currentStep={currentStep}
				currentSection={Questionnaire[step - 1]?.section}
				currentQuestions={Questionnaire[step - 1]?.questions}
				numberOfCurrentQuestions={Questionnaire[step - 1]?.questions.length || 0}
			/>

			<Portal>
				<Modal
					visible={showProfileZoom}
					onDismiss={hideProfileZoom}
					dismissable={false}
					dismissableBackButton={true}
					contentContainerStyle={{}}
				>
					<TouchableOpacity
						onPress={hideProfileZoom}
						style={{
							alignItems: 'center',
							flexDirection: 'row',
							rowGap: 4,
							padding: 20,
							paddingLeft: 50,
							paddingRight: 30,
							paddingBottom: 30,
							position: 'absolute',

							transform: [{ translateX: 260 }, { translateY: -300 }],

							borderRadius: 100
						}}
						activeOpacity={0.7}
					>
						<X color={styles.icon.colors._05} />
					</TouchableOpacity>
					<Text
						style={{
							position: 'absolute',
							fontFamily: styles.font.family,
							color: styles.font.colors._04,
							alignSelf: 'center',
							transform: [{ translateY: -190 }],
							fontWeight: styles.font.weight.light
						}}
					>
						Double-tap or pinch to zoom the image
					</Text>

					<View
						style={{
							alignSelf: 'center',
							transform: [{ translateY: 210 }],
							position: 'absolute',
							alignItems: 'center',
							rowGap: styles.spacing.md
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.font.colors._04,
								fontWeight: styles.font.weight.light,
								fontSize: styles.font.size.lg
							}}
						>
							{imageZoomSrc?.label}
						</Text>

						{imageZoomSrc?.description && (
							<Text
								style={{
									fontFamily: styles.font.family,
									color: styles.font.colors._04,

									fontWeight: styles.font.weight.light,
									fontSize: styles.font.size.lg
								}}
							>
								{imageZoomSrc.description}
							</Text>
						)}
					</View>

					<ResumableZoom
						style={{
							backgroundColor: 'transparent'
						}}
						maxScale={2}
					>
						<Image
							source={imageZoomSrc?.src}
							style={{
								borderRadius: 20,

								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								aspectRatio: 1,
								width: 320
							}}
						/>
					</ResumableZoom>
				</Modal>

				<Modal
					visible={visible}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							padding: 20,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].card_border,
							borderRadius: styles.border.radius.size.md,
							alignItems: 'center',
							rowGap: 30
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Hold the option to view the image clearly
						</Text>

						<View
							style={{
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								borderRadius: 14,
								aspectRatio: 9 / 16,

								width: 100,
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<AlbumImage size={80} color={styles.theme.colors[activeTheme].icon} />
						</View>

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={hideModal}
							style={{
								backgroundColor: styles.theme.colors.primary,
								marginTop: 14,
								paddingVertical: 10,
								paddingHorizontal: 40,
								borderRadius: styles.border.radius.size.sm
							}}
						>
							<Text
								style={{
									fontFamily: styles.font.family,
									color: '#fff'
								}}
							>
								Got it!
							</Text>
						</TouchableOpacity>
					</View>

					<LottieView
						autoPlay={true}
						source={activeTheme === 'light' ? holdGesture : holdGestureWhite}
						style={{
							position: 'absolute',
							transform: [{ translateY: 50 }, { translateX: 40 }],
							aspectRatio: 1,
							width: 80
						}}
					/>
				</Modal>
			</Portal>
		</>
	);
}
