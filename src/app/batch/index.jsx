import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View
} from 'react-native';

import { useEffect, useRef, useState } from 'react';
import QuestionMark from '@/components/icons/hugeicons/QuestionMark';
import styles from '@/config/styles';
import { Modal, Portal } from 'react-native-paper';
import { useThemeStore } from '@/stores/useThemeStore';
import { storage } from '@/config/mmkv';
import { onScroll } from '@/utility/scrollView';
import InitialPage from '@/components/batch/InitialPage';
import ResultPage from '@/components/batch/ResultPage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import InfiniteFade from '@/components/InfiniteFade';
import { batchCodeLookup } from '@/services/cloudFunctions';
import { useDebouncedCallback } from 'use-debounce';
import { useBackHandler } from '@react-native-community/hooks';

const disclaimerSchema = [
	{
		name: 'How It Works',
		contents: [
			'The FDA Product Verifier cross-references publicly available data from the Food and Drug Administration Verification Portal. While we strive to maintain accurate and up-to-date information, recent updates to the official database may take time to appear in verification results.'
		]
	},

	{
		name: 'Accuracy & Limitations',
		contents: [
			'Batch code formats vary significantly between manufacturers and may change over time. Some brands use proprietary or non-public coding systems that cannot always be accurately decoded.',
			'Results provided by this tool are estimates only and may not reflect official manufacturer data. Always prioritize expiration dates or printed usage instructions found directly on the product packaging when available.'
		]
	},

	{
		name: 'PAO Symbol Reminder',
		contents: [
			'The PAO (Period After Opening) symbol indicates how long a product remains suitable for use after it has been opened.',
			'Once opened, the PAO guideline should generally take precedence over the estimated unopened shelf life.'
		]
	},

	{
		name: 'Safety Notice',
		contents: [
			'This tool is provided for informational purposes only and does not guarantee product safety, stability, authenticity, or effectiveness.',
			'If you notice unusual odor, discoloration, separation, texture changes, or skin irritation, discontinue use immediately and consult the product manufacturer or a qualified healthcare professional when necessary.'
		]
	}
];

const isCloseToBottom = (layoutMeasurement, contentOffset, contentSize) => {
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
};

const formSchema = z.object({
	brand: z.object(
		{
			text: z.string(),
			keyParameters: z.string()
		},
		{ error: 'Please select a brand' }
	),
	code: z
		.string({ error: 'Please enter a code' })
		.min(2, { error: 'Please enter a code' })
});

const batchBlackLoader = require('assets/lottie/black-loading-time.json');
const batchWhiteLoader = require('assets/lottie/white-loading-time.json');

export default function BatchScreen() {
	const queryClient = useQueryClient();

	const { control, handleSubmit, reset } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			brand: null,
			code: ''
		}
	});

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [modalVisible, setModalVisible] = useState(false);
	const loaderRef = useRef(null);
	const [isDisplayInitialPage, setIsDisplayInitialPage] = useState(true);
	const [resultVisible, setResultVisible] = useState(false);

	const showInitialPage = () => setIsDisplayInitialPage(true);
	const hideInitialPage = () => setIsDisplayInitialPage(false);

	const showResultPage = () => setResultVisible(true);
	const hideResultPage = () => setResultVisible(false);

	const [disclaimerButtonActive, setDisclaimerButtonActive] = useState(true);

	const [disclaimerVisible, setDisclaimerVisible] = useState(false);
	const isShownDisclaimer = storage.getBoolean('batch-disclaimer-shown');

	const scrollRef = useRef(null);

	const router = useRouter();

	const { mutate, data, isPending } = useMutation({
		mutationFn: batchCodeLookup,
		onSuccess: () => {
			reset();
			showResultPage();
			queryClient.invalidateQueries({ queryKey: ['batch_history'] });
		},
		onError: (err) => {
			showInitialPage();
		}
	});

	const onVerify = async (data) => {
		hideInitialPage();

		mutate({
			...data,
			clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		});
	};

	const onVerifyAnotheProduct = async () => {
		hideResultPage();
		showInitialPage();
	};

	const showDisclaimer = () => setDisclaimerVisible(true);
	const hideDisclaimer = () => setDisclaimerVisible(false);
	const delayShowDisclaimer = useDebouncedCallback(showDisclaimer, 300);

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
			<View
				style={{
					flex: 1,
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
			>
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
							Batch Code Lookup
						</Text>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.light,
								color: styles.font.colors._04
							}}
						>
							Check Product Freshness
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
			</View>

			{isDisplayInitialPage && (
				<InitialPage
					control={control}
					onSubmit={handleSubmit(onVerify)}
					activeTheme={activeTheme}
				/>
			)}

			{isPending && (
				<Animated.View
					style={[
						{
							...StyleSheet.absoluteFillObject,
							alignItems: 'center',
							justifyContent: 'center',
							zIndex: 1
						}
					]}
				>
					<LottieView
						speed={1.6}
						autoPlay={true}
						ref={loaderRef}
						source={activeTheme === 'dark' ? batchWhiteLoader : batchBlackLoader}
						style={{ width: '80%', height: '80%' }}
					/>

					<View style={{ transform: [{ translateY: 100 }], position: 'absolute' }}>
						<InfiniteFade>
							<Text
								style={{
									fontWeight: styles.font.weight.semi_bold,
									fontFamily: styles.font.family,
									fontSize: styles.font.size.lg,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Verifying...
							</Text>
						</InfiniteFade>
					</View>
				</Animated.View>
			)}

			{resultVisible && (
				<ResultPage
					results={data}
					onPress={onVerifyAnotheProduct}
					activeTheme={activeTheme}
				/>
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
							borderColor: styles.theme.colors[activeTheme].card_border,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: styles.theme.colors[activeTheme].card_border,
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

						<ScrollView
							onMomentumScrollEnd={({ nativeEvent }) => {
								const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

								if (isCloseToBottom(layoutMeasurement, contentOffset, contentSize)) {
									setDisclaimerButtonActive(false);
								}
							}}
							ref={scrollRef}
							onScroll={onScroll(scrollRef)}
							showsVerticalScrollIndicator={false}
							style={{ height: 500 }}
							contentContainerStyle={{
								padding: styles.spacing.one_xxl,
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
						</ScrollView>

						<View
							style={{
								borderTopWidth: 1,
								borderTopColor: styles.theme.colors[activeTheme].card_border
							}}
						>
							<TouchableOpacity
								disabled={disclaimerButtonActive && !isShownDisclaimer}
								onPress={() => {
									hideDisclaimer();

									if (!isShownDisclaimer) {
										storage.set('batch-disclaimer-shown', true);
									}
								}}
								activeOpacity={0.7}
								style={{
									opacity: disclaimerButtonActive && !isShownDisclaimer ? 0.5 : 1,
									margin: styles.spacing.double_xxl,
									backgroundColor: styles.theme.colors.batch,
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
									backgroundColor: styles.theme.colors.batch,
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
