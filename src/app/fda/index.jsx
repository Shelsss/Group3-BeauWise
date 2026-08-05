import { useRouter } from 'expo-router';
import { ChevronLeft, Circle, X } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { Modal, Portal } from 'react-native-paper';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';

import Animated, { FadeIn } from 'react-native-reanimated';
import QuestionMark from '@/components/icons/hugeicons/QuestionMark';
import { storage } from '@/config/mmkv';
import { useDebouncedCallback } from 'use-debounce';
import InitialPage from '@/components/fda/InitialPage';
import ResultPage from '@/components/fda/ResultPage';
import LottieView from 'lottie-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InfiniteFade from '@/components/InfiniteFade';
import { useBackHandler } from '@react-native-community/hooks';
import Toast from 'react-native-toast-message';
import { fdaService } from '@/services/fdaService';

const fdaLoader = require('assets/lottie/fda-loader.json');

const disclaimerSchema = [
	{
		name: 'Data Source',
		contents: [
			'The FDA Product Verifier cross-references publicly available data from the Food and Drug Administration Verification Portal. While we strive to maintain accurate and up-to-date information, recent updates to the official database may take time to appear in verification results.'
		]
	},

	{
		name: 'Affiliation & Endorsement',
		contents: [
			'This tool is provided for informational purposes only and is not affiliated with, endorsed by, or officially connected to the FDA Philippines.'
		]
	},

	{
		name: 'Scope of Verification',
		contents: [
			'Verification results confirm FDA notification or registration status only and do not certify product safety, authenticity, effectiveness, quality, or dermatological suitability.',
			'Consumers are encouraged to consult qualified healthcare professionals or licensed dermatologists for personalized medical, skincare, or treatment-related advice.'
		]
	}
];

const productSchema = z.object({
	product: z.string().min(2, { error: 'Please enter a valid product' })
});

const notificationNumberSchema = z.object({
	notificationNumber: z
		.string()
		.min(4, { error: 'Please enter a valid notification number' })
		.startsWith('NN-', {
			error: 'Please make sure the format is correct (e.g., NN-xxxxxx)'
		})
});

export default function BatchScreen() {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState(1);
	const [indexLoading, setIndexLoading] = useState(0);
	const formSchema = activeTab === 1 ? productSchema : notificationNumberSchema;
	const { control, handleSubmit, reset } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			notificationNumber: '',
			product: ''
		}
	});

	const isShownDisclaimer = storage.getBoolean('fda-disclaimer-shown');

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const router = useRouter();

	// fdaVerification
	const { mutate, data, isPending, isSuccess } = useMutation({
		mutationFn: async ({ data, clientTimeZone }) => {
			const response = await fdaService(data, clientTimeZone);

			return response;
		},
		onSuccess: (result) => {
			if (result.status.code >= 500) {
				throw new Error('Something went wrong. Please try again');
			}

			setIndexLoading(0);
			setActiveTab(1);
			reset();
			showResultPage();
			queryClient.invalidateQueries({ queryKey: ['fda_history'] });
			queryClient.invalidateQueries({ queryKey: ['metrics'] });
		},
		onError: (err) => {
			Toast.show({
				type: 'errorToast',
				text1: err.message
			});
			showInitialPage();
		}
	});

	const [modalVisible, setModalVisible] = useState(false);

	const [isDisplayInitialPage, setIsDisplayInitialPage] = useState(true);
	const [disclaimerVisible, setDisclaimerVisible] = useState(false);
	const [resultVisible, setResultVisible] = useState(false);

	const loaderRef = useRef(null);

	const showDisclaimer = () => setDisclaimerVisible(true);
	const hideDisclaimer = () => setDisclaimerVisible(false);

	const showInitialPage = () => setIsDisplayInitialPage(true);
	const hideInitialPage = () => setIsDisplayInitialPage(false);

	const showResultPage = () => setResultVisible(true);
	const hideResultPage = () => setResultVisible(false);

	const playLoader = () => loaderRef.current?.play();

	const delayShowDisclaimer = useDebouncedCallback(showDisclaimer, 300);

	const onVerify = async (data) => {
		hideInitialPage();
		playLoader();
		mutate({
			data,
			clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		});
	};

	const onVerifyAnotheProduct = async () => {
		hideResultPage();
		showInitialPage();
	};

	const onTabChanged = (tab) => {
		setActiveTab(tab);

		reset();
	};

	const loadingTexts = [
		'Please wait',
		'Checking database',
		'Searching in FDA database',
		'Verifying'
	];

	useEffect(() => {
		if (isSuccess) return;

		const timer = setInterval(() => {
			setIndexLoading((prev) => {
				if (prev >= loadingTexts.length - 1) {
					clearInterval(timer);
					return prev;
				}

				return prev + 1;
			});
		}, 3500);

		return () => clearInterval(timer);
	}, [isPending, isSuccess, loadingTexts.length]);

	useBackHandler(() => {
		if (isPending) {
			setModalVisible(true);
			return true;
		}
	}, [isPending, modalVisible]);

	useEffect(() => {
		if (!isShownDisclaimer) {
			delayShowDisclaimer();
		}
	}, []);

	useEffect(() => {
		if (!isPending && modalVisible) {
			setModalVisible(false);
		}
	}, [isPending, modalVisible]);

	return (
		<>
			<View style={STYLES.container}>
				<View
					style={{
						backgroundColor: styles.theme.colors.primary,
						paddingHorizontal: 15,
						paddingTop: 62,
						paddingBottom: styles.spacing.double_xxl,
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<TouchableOpacity
						onPress={router.back}
						style={{
							paddingRight: styles.spacing.xxl
						}}
					>
						<ChevronLeft color={styles.icon.colors._05} size={styles.icon.size.xl} />
					</TouchableOpacity>

					<View>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.xl,
								fontWeight: styles.font.weight.bold,
								color: styles.font.colors._04
							}}
						>
							FDA Product Verifier
						</Text>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.light,
								color: styles.font.colors._04
							}}
						>
							Verify FDA Compliance Status
						</Text>
					</View>

					<TouchableOpacity
						onPress={showDisclaimer}
						activeOpacity={0.7}
						style={{ alignSelf: 'center', marginLeft: 'auto' }}
					>
						<QuestionMark
							size={styles.icon.size.xl * 1.4}
							color={styles.background_color._04}
						/>
					</TouchableOpacity>
				</View>

				{isDisplayInitialPage && (
					<InitialPage
						activeTheme={activeTheme}
						onSubmit={handleSubmit(onVerify)}
						controllerName={activeTab === 1 ? 'product' : 'notificationNumber'}
						control={control}
						activeTab={activeTab}
						onTabChanged={onTabChanged}
					/>
				)}

				{resultVisible && (
					<ResultPage
						results={data}
						onPress={onVerifyAnotheProduct}
						activeTheme={activeTheme}
					/>
				)}
			</View>

			{isPending && (
				<Animated.View
					entering={FadeIn}
					style={[
						{
							...StyleSheet.absoluteFillObject,
							alignItems: 'center',
							justifyContent: 'center',
							zIndex: -1
						}
					]}
				>
					<LottieView
						ref={loaderRef}
						speed={1.4}
						source={fdaLoader}
						autoPlay={true}
						style={{ width: '90%', height: '90%' }}
					/>
					<View
						style={{ transform: [{ translateY: 90 }], position: 'absolute', zIndex: 5 }}
					>
						<InfiniteFade>
							<Text
								style={{
									padding: 90,
									fontWeight: styles.font.weight.semi_bold,
									fontFamily: styles.font.family,
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text,
									textAlign: 'center'
								}}
							>
								{loadingTexts[indexLoading]}...
							</Text>
						</InfiniteFade>
					</View>
				</Animated.View>
			)}

			<Portal>
				<Modal
					theme={activeTheme}
					visible={disclaimerVisible}
					style={{
						marginHorizontal: styles.spacing.one_xl
					}}
				>
					<View
						style={{
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].card_border,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								padding: styles.spacing.one_xxl
							}}
						>
							<Text
								style={{
									fontSize: styles.font.size.lg,
									fontWeight: styles.font.weight.semi_bold,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Disclaimer
							</Text>
						</View>

						<View
							style={{
								padding: styles.spacing.one_xxl,
								borderTopWidth: 1,
								borderBottomWidth: 1,
								borderTopColor: styles.theme.colors[activeTheme].card_border,
								borderBottomColor: styles.theme.colors[activeTheme].card_border,
								rowGap: styles.spacing.one_xxl
							}}
						>
							{disclaimerSchema.map((item) => (
								<View key={item.name}>
									<Text
										style={{
											fontWeight: styles.font.weight.bold,
											fontSize: styles.font.size.md,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{item.name}
									</Text>

									<View style={{ rowGap: styles.spacing.lg }}>
										{item.contents.map((content) => (
											<Text
												key={content}
												style={{
													fontSize: styles.font.size.md,
													fontFamily: styles.font.family,
													color: styles.theme.colors[activeTheme].text_secondary
												}}
											>
												{content}
											</Text>
										))}
									</View>
								</View>
							))}
						</View>

						<TouchableOpacity
							onPress={() => {
								hideDisclaimer();

								if (!isShownDisclaimer) {
									storage.set('fda-disclaimer-shown', true);
								}
							}}
							activeOpacity={0.7}
							style={{
								margin: styles.spacing.double_xxl,
								backgroundColor: styles.theme.colors.fda,
								alignItems: 'center',
								borderRadius: styles.border.radius.size.sm,
								paddingVertical: styles.spacing.one_xl
							}}
						>
							<Text
								style={{
									fontWeight: styles.font.weight.bold,
									fontFamily: styles.font.family,
									fontSize: styles.font.size.md,
									color: styles.font.colors._04
								}}
							>
								I understand
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</Portal>

			<Portal>
				<Modal visible={modalVisible}>
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
							Are you sure you want to cancel?
						</Text>

						<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
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
								onPress={router.back}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									backgroundColor: styles.theme.colors.fda,
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

const STYLES = StyleSheet.create({
	container: {
		flex: 1
	}
});

// <View
// 	style={{
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		flex: 1,
// 		rowGap: 40,

// 		paddingHorizontal: 24,
// 		marginBottom: bottom + 20
// 	}}
// >
// 	<Shadow
// 		stretch={true}
// 		distance={2}
// 		startColor='#00000010'
// 		offset={[0, 1]}
// 		containerStyle={{
// 			width: '100%'
// 		}}
// 	>
// 		<View
// 			style={{
// 				backgroundColor: Colors.backgroundColor,
// 				padding: 16,
// 				borderRadius: 24,
// 				rowGap: 24
// 			}}
// 		>
// 			<AnimatedTabs
// 				tabs={[fdaSchema[0].name, fdaSchema[1].name]}
// 				currentIndex={activeTab}
// 				handleTabChange={handleTabChange}
// 			/>

// 			<SearchBar
// 				handleQuery={handleQuery}
// 				placeholder={fdaSchema[activeTab].placeholder}
// 			/>
// 			<View style={{ flexDirection: 'row' }}>
// 				<View style={{ marginTop: 3, marginRight: 4 }}>
// 					<Info size={11} color={Colors.primary} />
// 				</View>

// 				<Text
// 					style={{
// 						fontSize: 12,
// 						color: Colors.textColor + '7a',
// 						width: 260
// 					}}
// 				>
// 					Tip: Enter the exact product name as it appears on the packaging for better
// 					results.
// 				</Text>
// 			</View>

// 			<Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
// 				<Pressable
// 					onPress={handlePress}
// 					style={{
// 						columnGap: 12,
// 						flexDirection: 'row',
// 						justifyContent: 'center',
// 						alignItems: 'center',
// 						backgroundColor: Colors.primary,
// 						padding: 16,
// 						borderRadius: 16
// 					}}
// 				>
// 					<Text
// 						style={{
// 							fontSize: 16,
// 							fontWeight: 600,
// 							color: Colors.backgroundColor
// 						}}
// 					>
// 						Verify Product
// 					</Text>
// 					<CircleCheck size={16} color={Colors.backgroundColor} />
// 				</Pressable>
// 			</Shadow>
// 		</View>
// 	</Shadow>
// </View>
