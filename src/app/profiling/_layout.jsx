import AlbumImage from '@/components/icons/hugeicons/AlbumImage';
import ProfilingFooter from '@/components/profiling/ProfilingFooter';
import ProfilingHeader from '@/components/profiling/ProfilingHeader';
import Colors from '@/constants/Colors';
import Questionnaire from '@/constants/Questionnaire';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { Image } from 'expo-image';

import { Slot, useGlobalSearchParams, useSegments } from 'expo-router';
import LottieView from 'lottie-react-native';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { ResumableZoom } from 'react-native-zoom-toolkit';
import { useDebouncedCallback } from 'use-debounce';

export default function ProfilingLayout() {
	const params = useGlobalSearchParams();
	const segments = useSegments();

	const isTransition = segments.includes('transition');
	const step = parseInt(params.step);

	const currentStep = isTransition
		? parseInt(params.nextStep) || 0
		: parseInt(params.step) || 0;

	const showProfileZoom = useProfilingStore((state) => state.showProfileZoom);
	const setShowProfileZoom = useProfilingStore((state) => state.setShowProfileZoom);

	const imageZoomSrc = useProfilingStore((state) => state.imageZoomSrc);
	const hideProfileZoom = () => setShowProfileZoom(!showProfileZoom);

	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const debounceShowModal = useDebouncedCallback(showModal, 280);

	return (
		<>
			<ProfilingHeader isTransition={isTransition} currentStep={currentStep} />
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
						<X color={'#fff'} />
					</TouchableOpacity>
					<Text
						style={{
							position: 'absolute',
							fontFamily: 'Outfit',
							color: '#fff',
							alignSelf: 'center',
							transform: [{ translateY: -190 }],
							fontWeight: 500
						}}
					>
						Double-tap or pinch to zoom the image
					</Text>

					<Text
						style={{
							position: 'absolute',
							fontFamily: 'Outfit',
							color: '#fff',
							alignSelf: 'center',
							transform: [{ translateY: 200 }],
							fontWeight: 500,
							fontSize: 16
						}}
					>
						{imageZoomSrc?.label}
					</Text>
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

								backgroundColor: Colors.backgroundColor,
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
							backgroundColor: Colors.backgroundColor,
							borderRadius: 20,
							alignItems: 'center',
							rowGap: 30
						}}
					>
						<Text style={{ fontFamily: 'Outfit', color: Colors.textColor }}>
							Hold the option to view the image clearly
						</Text>

						<View
							style={{
								borderWidth: 1,
								borderColor: '#3341554a',
								borderRadius: 14,
								aspectRatio: 9 / 16,

								width: 100,
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<AlbumImage size={80} color='#334155' />
						</View>

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={hideModal}
							style={{
								backgroundColor: Colors.primary,
								marginTop: 14,
								paddingVertical: 10,
								paddingHorizontal: 40,
								borderRadius: 40
							}}
						>
							<Text
								style={{
									fontFamily: 'Outfit',
									color: '#fff'
								}}
							>
								Got it!
							</Text>
						</TouchableOpacity>
					</View>

					<LottieView
						autoPlay={true}
						source={require('assets/lottie/touch-hold-gesture.json')}
						style={{
							position: 'absolute',
							transform: [{ translateY: 50 }, { translateX: 40 }],
							aspectRatio: 1,
							width: 120
						}}
					/>
				</Modal>
			</Portal>
		</>
	);
}
