import Info from '@/components/icons/Info';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { ingredientScan } from '@/services/cloudFunctions';
import { ingredientScanService } from '@/services/ingredientScanService';
import { useScanStore } from '@/stores/useScanStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useBackHandler } from '@react-native-community/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useGlobalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function Processing() {
	// const queryClient = useQueryClient();
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const imageBase64 = useScanStore((state) => state.imageBase64);
	const setIngredients = useScanStore((state) => state.setIngredients);

	const [visible, setVisible] = useState(false);

	const cancelController = useRef(null);
	const { mutate } = useMutation({
		mutationFn: async (imageBase64) => {
			cancelController.current = new AbortController();

			const timeoutId = setTimeout(() => cancelController.current.abort(), 30000);

			let response = null;

			try {
				response = await ingredientScanService(
					imageBase64,
					cancelController.current.signal
				);
			} finally {
				clearTimeout(timeoutId);
			}

			return response;
		},
		mutationKey: ['ocr-processing'],
		onSuccess: ({ data }) => {
			setIngredients([...data]);
			router.replace('/scanner/details');
		},

		onError: (err) => {
			let errMessage = 'Something went wrong. Please try again';

			if (err.message) {
				errMessage = err.message;
			}

			Toast.show({
				type: 'errorToast',
				text1: errMessage,
				visibilityTime: 8000
			});

			router.back();
		}
	});

	useBackHandler(() => {
		setVisible(true);
		return true;
	}, []);

	useEffect(() => {
		mutate(imageBase64);
	}, []);

	const handleCancel = () => {
		cancelController.current.abort();
	};
	return (
		<>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Animated.View entering={FadeIn.delay(300)} exiting={FadeOut}>
					<LottieView
						style={{
							aspectRatio: 1,
							width: 400
						}}
						resizeMode='contain'
						autoPlay
						loop={true}
						source={require('assets/lottie/loader-particles.json')}
					/>
				</Animated.View>
			</View>
			<Portal>
				<Modal visible={visible}>
					<View
						style={{
							rowGap: styles.spacing.one_xl,
							padding: styles.spacing.one_xxl,
							alignSelf: 'center',
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Are you sure you want to cancel the scan?
						</Text>

						<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
							<TouchableOpacity
								onPress={() => setVisible(false)}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									paddingHorizontal: styles.spacing.three_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text style={{ color: styles.theme.colors[activeTheme].text }}>No</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleCancel}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									backgroundColor: styles.theme.colors.primary,
									paddingHorizontal: styles.spacing.one_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.font.colors._04
									}}
								>
									Yes
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
