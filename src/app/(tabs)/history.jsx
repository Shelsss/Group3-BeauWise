import CustomHeader from '@/components/CustomHeader';
import BatchHistory from '@/components/history/BatchHistory';

import FdaHistory from '@/components/history/FdaHistory';
import GuestModeView from '@/components/history/GuessModeView';
import HistoryBottomSheet from '@/components/history/HistoryBottomSheet';
import AnalysisHistory from '@/components/history/AnalysisHistory';
import Filter from '@/components/icons/hugeicons/Filter';

import styles from '@/config/styles';

import PagePadding from '@/constants/PagePadding';

import { useAuthStore } from '@/stores/useAuthStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useThemeStore } from '@/stores/useThemeStore';
import historyTabs from '@/utility/historyTabs';

import { Search } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
	View,
	useColorScheme,
	TextInput,
	TouchableOpacity,
	useWindowDimensions
} from 'react-native';

import Animated from 'react-native-reanimated';

import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useDebouncedCallback } from 'use-debounce';
import { useFocusEffect } from 'expo-router';
import { storage } from '@/config/mmkv';
import QuestionMark from '@/components/icons/hugeicons/QuestionMark';
import Disclaimer from '@/components/Disclaimer';

const renderScene = SceneMap({
	analysis_history: AnalysisHistory,
	batch_history: BatchHistory,
	fda_history: FdaHistory
});

const routes = [...historyTabs];

const disclaimerSchema = [
	{
		name: 'About Your History Data',
		contents: [
			'Saved records are provided for your personal reference and convenience only. Information stored in your history reflects the analysis, verification, or lookup results available at the time the record was created.',
			'Because cosmetic formulations, ingredient references, manufacturer coding systems, and regulatory records may change over time, previously saved results may not reflect the most current information available. Users are encouraged to perform a new scan, verification, or lookup whenever up-to-date information is required.'
		]
	},

	{
		name: 'Ingredient Analysis Records',
		contents: [
			'Ingredient analyses, compatibility indicators, profile-based insights, and educational content are generated using information extracted from product labels, your self-reported profile, cosmetic science references, and established dermatological literature.',
			'Results are intended solely for educational and informational purposes and do not constitute medical advice, diagnosis, treatment, or professional healthcare recommendations.',
			'BeauWise does not perform laboratory testing, chemical verification, ingredient authentication, concentration or percentage analysis, formulation stability testing, allergen testing, or therapeutic evaluation.',
			'Analysis results are designed only for externally applied cosmetic products, including facial skincare, haircare, and cosmetic makeup products. The feature is not intended for medications, prescription treatments, supplements, ingestible products, or medical devices.',
			'If you are pregnant, breastfeeding, undergoing medical treatment, or have a diagnosed skin, scalp, or allergic condition, consult a licensed healthcare professional or dermatologist before using new cosmetic products or active ingredients.'
		]
	},

	{
		name: 'Batch Code Lookup Records',
		contents: [
			'Manufacturing dates, production periods, and shelf life estimates are generated using publicly available batch code references, manufacturer conventions, and known coding patterns.',
			'Because batch code systems vary by manufacturer and may change without notice, historical lookup results may differ from current manufacturer information or updated decoding references.',
			'Always prioritize expiration dates, usage instructions, storage recommendations, and PAO (Period After Opening) symbols printed on the product packaging whenever available.',
			'If a product develops an unusual odor, discoloration, separation, contamination, texture changes, or causes irritation, discontinue use immediately regardless of any shelf life estimate displayed by the application.'
		]
	},
	{
		name: 'FDA Verification Records',
		contents: [
			'FDA verification results reflect the notification or registration information available at the time the search was performed.',
			"Regulatory records may be updated, suspended, expired, revoked, corrected, or otherwise modified by the relevant regulatory authority after a record has been saved. Historical results should not be interpreted as confirmation of a product's current regulatory status.",
			'Users should perform a new verification search whenever current FDA information is required.'
		]
	},
	{
		name: 'General Notice',
		contents: [
			'BeauWise is provided solely for educational and informational purposes.',
			'The platform is not affiliated with, endorsed by, sponsored by, or officially connected to the Food and Drug Administration (FDA) Philippines or any other government agency, regulatory authority, cosmetic manufacturer, or commercial brand.',
			'All analyses, educational content, verification tools, and lookup features are intended to support cosmetic literacy and informed consumer awareness. BeauWise does not certify product safety, authenticity, effectiveness, quality, regulatory compliance, or suitability for any individual user.',
			'Certain features, including FDA verification results and regulatory references, are designed primarily for cosmetic products available within the Philippines and may not apply to products regulated in other countries or regions.'
		]
	},
	{
		name: 'No Medical Advice',
		contents: [
			'The educational resources within BeauWise do not establish a healthcare provider-patient relationship and should not be used as a substitute for consultation with a licensed dermatologist, physician, pharmacist, or other qualified healthcare professional.'
		]
	},
	{
		name: 'Professional Consultation Recommended',
		contents: [
			'If you have a diagnosed skin or scalp condition, known allergies, persistent irritation, unusual skin reactions, are pregnant or breastfeeding, or are considering significant changes to your skincare or haircare routine, consult a licensed dermatologist or qualified healthcare professional before making product-related decisions based on information provided within BeauWise.'
		]
	},
	{
		name: 'User Responsibility',
		contents: [
			'Users remain responsible for evaluating cosmetic products, reviewing official product labeling, following manufacturer instructions, and seeking professional guidance when appropriate. BeauWise educational resources are intended to supplement, not replace, professional judgment and expert consultation.'
		]
	}
];

export default function HistoryScreen() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const setFilter = useHistoryStore((state) => state.setFilter);

	const [disclaimerButtonActive, setDisclaimerButtonActive] = useState(true);
	const [disclaimerVisible, setDisclaimerVisible] = useState(false);
	const isShownDisclaimer = storage.getBoolean('history-disclaimer-shown');

	const showDisclaimer = () => setDisclaimerVisible(true);
	const hideDisclaimer = () => setDisclaimerVisible(false);
	const delayShowDisclaimer = useDebouncedCallback(showDisclaimer, 300);

	const handleDisclaimer = () => {
		if (!isAuthenticated) return;
		hideDisclaimer();

		if (!isShownDisclaimer) {
			storage.set('history-disclaimer-shown', true);
		}
	};

	const disclaimerDisable = disclaimerButtonActive && !isShownDisclaimer;

	const index = useHistoryStore((state) => state.index);
	const setIndex = useHistoryStore((state) => state.setIndex);

	const setQuery = useHistoryStore((state) => state.setQuery);

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const historySheetModalRef = useRef(null);

	const layout = useWindowDimensions();

	const onPressFilter = () => {
		historySheetModalRef.current?.present();
	};

	const delaySearchQuery = useDebouncedCallback((val) => {
		setQuery(val);
	}, 200);

	useFocusEffect(
		useCallback(() => {
			if (!isShownDisclaimer && isAuthenticated) {
				delayShowDisclaimer();
			}
		}, [isAuthenticated, isShownDisclaimer])
	);
	return (
		<View style={{ flex: 1 }}>
			<View>
				<CustomHeader title={'History'} disableShadow={true} />
				{isAuthenticated && (
					<View
						style={{
							backgroundColor: styles.theme.colors.primary,
							paddingHorizontal: PagePadding.config.paddingHorizontal,
							paddingBottom: styles.spacing.double_xl,
							zIndex: 2,

							rowGap: 16
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								columnGap: 10
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									flex: 1,
									alignItems: 'center',
									backgroundColor: styles.theme.colors[activeTheme].input_background,

									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Search
									size={styles.icon.size.xl}
									strokeWidth={1.5}
									style={{
										marginLeft: styles.spacing.xl,
										marginRight: styles.spacing.sm
									}}
									color={styles.theme.colors[activeTheme].icon + '9a'}
								/>
								<TextInput
									onChangeText={(val) => delaySearchQuery(val)}
									selectionColor={styles.theme.colors.primary}
									selectionHandleColor={styles.icon.colors._05}
									enterKeyHint='search'
									cursorColor={styles.theme.colors.primary}
									style={{
										flexGrow: 1,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text,
										fontFamily: styles.font.family
									}}
								/>

								<TouchableOpacity
									onPress={onPressFilter}
									style={{
										padding: styles.spacing.lg,
										marginRight: styles.spacing.md
									}}
								>
									<Filter
										color={styles.theme.colors.primary}
										size={styles.icon.size.xl}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}

				{isAuthenticated && (
					<TouchableOpacity
						onPress={showDisclaimer}
						activeOpacity={0.7}
						style={{
							alignSelf: 'center',
							marginLeft: 'auto',
							position: 'absolute',
							top: 72,
							right: 20
						}}
					>
						<QuestionMark
							size={styles.icon.size.xl * 1.4}
							color={styles.background_color._04}
						/>
					</TouchableOpacity>
				)}
			</View>

			{!isAuthenticated && <GuestModeView />}

			{isAuthenticated && (
				<HistoryBottomSheet
					onChangeFilter={setFilter}
					historySheetModalRef={historySheetModalRef}
					activeTheme={activeTheme}
				/>
			)}

			<Disclaimer
				schema={disclaimerSchema}
				disclaimerVisible={disclaimerVisible}
				disabled={disclaimerDisable}
				onPress={handleDisclaimer}
				backgroundColor={styles.theme.colors.primary}
				setDisclaimerButtonActive={setDisclaimerButtonActive}
			/>

			{isAuthenticated && (
				<>
					<TabView
						navigationState={{ index, routes }}
						renderScene={renderScene}
						onIndexChange={setIndex}
						initialLayout={{ width: layout.width }}
						renderTabBar={(props) => (
							<TabBar
								{...props}
								indicatorStyle={{
									backgroundColor: 'white',
									borderRadius: styles.border.radius.size.pill,
									marginBottom: 10,
									marginHorizontal: styles.spacing.one_xl
								}}
								renderTabBarItem={(props) => {
									const index = props.navigationState.index;
									const currentRoute = props.navigationState.routes[index];
									const isActive = props.key === currentRoute.key;

									return (
										<TouchableOpacity
											onPress={props.onPress}
											style={{
												width: props.defaultTabWidth,
												marginBottom: styles.spacing.md,
												paddingVertical: styles.spacing.one_xl
											}}
										>
											<Animated.Text
												style={{
													fontSize: styles.font.size.md,
													textAlign: 'center',
													fontFamily: styles.font.family,
													color: styles.font.colors._04,
													opacity: isActive ? 1 : 0.7,
													transitionDuration: 240,
													pointerEvents: 'none'
												}}
											>
												{props.labelText}
											</Animated.Text>
										</TouchableOpacity>
									);
								}}
								style={{ backgroundColor: styles.theme.colors.primary }}
							/>
						)}
					/>
					<View
						style={{
							zIndex: 2,
							backgroundColor: 'red',
							aspectRatio: 1,
							width: 20,
							marginTop: styles.spacing.double_xxl
						}}
					/>
				</>
			)}
		</View>
	);
}
