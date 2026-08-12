import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedRef
} from 'react-native-reanimated';
import { useRef, useState } from 'react';
import SummaryCard from '@/components/EditCard';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import Colors from '@/constants/Colors';
import { Check, ChevronLeft } from 'lucide-react-native';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/IconTheme';
import { doc, setDoc, updateDoc } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { Swing } from 'react-native-animated-spinkit';
import { Modal, Portal } from 'react-native-paper';
import PagePadding from '@/constants/PagePadding';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import styles from '@/config/styles';
import AiUser2 from '@/components/icons/hugeicons/AiUser2';
import { useThemeStore } from '@/stores/useThemeStore';
import Questions from '@/constants/Questionnaire';
import { db } from '@/services/firestore';
import { storage } from '@/config/mmkv';

const SPACING = 154;
const isCloseToBottom = (layoutMeasurement, contentOffset, contentSize) => {
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
};
export default function ProfilingSummary() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const scrollViewRef = useAnimatedRef();
	const profileSheetModalRef = useRef(null);
	const { bottom, top } = useSafeAreaInsets();
	const [confirmVisible, setConfirmVisible] = useState(false);
	const profileData = useProfilingStore((state) => state.profile);

	const setIsProfilingComplete = useProfilingStore(
		(state) => state.setIsProfilingComplete
	);
	const resetProfile = useProfilingStore((state) => state.resetProfile);

	const profileMutation = useMutation({
		mutationFn: async (data) => {
			await setDoc(
				doc(db, 'users', auth.currentUser.uid),
				{
					profiling: data
				},
				{ merge: true }
			);
		},

		onMutate: () => showModal(),
		onSuccess: () => {
			resetProfile();
			storage.set('isProfilingComplete', true);
			router.dismissAll();
			router.replace('(tabs)');
			hideModal();
		},

		onError: (err) => {
			Toast.show({
				type: 'errorToast',
				text1: 'Oops, save failed!',
				text2: 'Something went wrong, please try again.',
				bottomOffset: 20
			});
			hideModal();
		}
	});

	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const router = useRouter();

	const onEdit = (step) => () => {
		router.navigate({
			pathname: `/profiling/${step}`,
			params: { fromSummary: true }
		});
	};

	const confirmButtonMargin = 10;
	const ConfirmButton = () => (
		<Animated.View entering={FadeIn} layout={LinearTransition.springify().damping(120)}>
			<TouchableOpacity
				activeOpacity={0.7}
				disabled={profileMutation.isPending}
				styles={{
					columnGap: 8
				}}
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					marginHorizontal: 20,
					borderRadius: styles.border.radius.size.sm,
					marginBottom: bottom + confirmButtonMargin,
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: 18,
					alignItems: 'center',
					justifyContent: 'center',
					paddingVertical: styles.spacing.xxl,
					flexDirection: 'row',

					columnGap: styles.spacing.lg
				}}
				onPress={() => {
					profileMutation.mutate(profileData);
				}}
			>
				<Check color={styles.icon.colors._05} size={14} strokeWidth={1.5} />
				<Text
					style={{
						fontFamily: styles.font.family,
						color: '#FFF',
						fontWeight: styles.font.weight.regular
					}}
				>
					Confirm & Save Profile
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);

	return (
		<>
			<Animated.ScrollView
				entering={FadeIn}
				exiting={FadeOut.duration(120)}
				ref={scrollViewRef}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				onMomentumScrollEnd={({ nativeEvent }) => {
					const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

					if (isCloseToBottom(layoutMeasurement, contentOffset, contentSize)) {
						setConfirmVisible(true);
					}
				}}
				scrollEventThrottle={400}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					padding: 20,
					rowGap: styles.spacing.xxl,
					paddingBottom: SPACING
				}}
			>
				<View style={{ marginTop: top }}>
					<TouchableOpacity
						onPress={router.back}
						style={{
							position: 'absolute',
							bottom: -4,
							left: 2,
							paddingEnd: 30,
							paddingLeft: 10,
							paddingTop: 20,
							paddingBottom: 12,
							zIndex: 1
						}}
					>
						<ChevronLeft size={18} color={styles.theme.colors[activeTheme].icon} />
					</TouchableOpacity>
					<Text
						style={{
							fontFamily: styles.font.family,
							textAlign: 'center',
							color: Colors.primary,
							fontSize: 12,
							fontWeight: styles.font.weight.bold
						}}
					>
						Profile Confirmation
					</Text>

					<Text
						style={{
							color: styles.theme.colors[activeTheme].text_secondary,
							fontFamily: styles.font.family,
							textAlign: 'center',
							fontSize: 9
						}}
					>
						Final Step
					</Text>
				</View>

				<View
					style={{
						paddingTop: top,
						paddingBottom: top,
						alignItems: 'center',
						rowGap: styles.spacing.lg
					}}
				>
					<AiUser2 size={styles.icon.size.xl * 3} color={styles.theme.colors.primary} />
					<Text
						style={{
							marginTop: styles.spacing.xxl,
							fontFamily: styles.font.family,
							fontSize: styles.font.size.xxl,
							fontWeight: styles.font.weight.semi_bold,
							color: styles.theme.colors.primary
						}}
					>
						Review Your Profile
					</Text>
					<Text
						style={{
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text_secondary,
							fontSize: styles.font.size.md,
							fontWeight: '350',
							textAlign: 'center'
						}}
					>
						Double-check your details below to ensure accurate recommendations.
					</Text>
				</View>

				{Object.keys(profileData).map((section, index) => (
					<SummaryCard
						activeTheme={activeTheme}
						questions={Questions}
						profileData={profileData}
						label={formatSnakeToTitle(section)}
						section={section}
						key={section}
						sectionValue={Object.entries(profileData[section])}
						onEdit={onEdit(index + 1)}
						iconProp={icons[index].icon(20, Colors.primary)}
						iconColor={Colors.primary}
					/>
				))}

				<View
					style={{
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						padding: 16,
						borderRadius: styles.border.radius.size.sm,
						marginTop: 18,
						rowGap: styles.spacing.sm
					}}
				>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.semi_bold,
							color: styles.theme.colors[activeTheme].text,
							fontSize: styles.font.size.md
						}}
					>
						Disclaimer and Consent
					</Text>

					<Text
						style={{
							lineHeight: styles.spacing.double_xl,
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.regular,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						I acknowledge that the profile data collected by BeauWise is utilized solely
						to cross reference cosmetic ingredients with established safety literature.
						This application is designed for educational purposes only and is not intended
						to diagnose, treat, or manage any medical skin or scalp conditions.
					</Text>
				</View>
			</Animated.ScrollView>

			{confirmVisible && <ConfirmButton />}

			<Portal>
				<Modal
					style={{
						marginHorizontal: PagePadding.config.paddingHorizontal
					}}
					visible={visible}
					onDismiss={hideModal}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							padding: 18,
							borderRadius: 10,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							alignItems: 'center',
							rowGap: 8
						}}
					>
						<Swing size={styles.icon.size.xl} color={styles.theme.colors.primary} />
						<Text
							style={{
								color: styles.theme.colors[activeTheme].text,
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular
							}}
						>
							Saving profile...
						</Text>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
