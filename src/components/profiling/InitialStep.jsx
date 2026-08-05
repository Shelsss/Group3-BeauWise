import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	useColorScheme
} from 'react-native';
import { Sparkles, Circle } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagePadding from '@/constants/PagePadding';
import { Checkbox } from 'expo-checkbox';
import { useRef } from 'react';
import { useProfilingStore } from '@/stores/useProfilingStore';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { staggerCardAnimation } from '@/utility/animations';
import AiUser from '../icons/hugeicons/AiUser';

const initialStepSchema = [
	{
		name: `What We'll Ask`,
		items: [
			'Skin type and environmental responses',
			'Hair pattern, texture, and care routine'
		]
	},

	{
		name: `What We Won't Ask`,
		items: [
			'Medical diagnoses or conditions',
			'Prescription medications or treatments',
			'Health records or sensitive medical data'
		]
	}
];

const medical_disclaimer_schema = {
	title: 'Medical Disclaimer & Consent',
	disclaimers: [
		'BeauWise provides educational cosmetic ingredient analysis and does not provide medical advice, diagnosis, or treatment.',
		'If you are pregnant, breastfeeding, using prescription skin medications, or have a diagnosed skin or scalp condition, consult a licensed healthcare professional before trying new cosmetic products.',
		'Profile-based recommendations are intended for informational purposes only and may not reflect individual medical conditions, allergies, sensitivities, or treatment needs.'
	]
};

export default function InitialStep() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const { top } = useSafeAreaInsets();

	const scrollViewRef = useRef(null);
	const setIsInitialStepButtonActive = useProfilingStore(
		(state) => state.setIsInitialStepButtonActive
	);

	const isInitialStepButtonActive = useProfilingStore(
		(state) => state.isInitialStepButtonActive
	);

	return (
		<ScrollView
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: PagePadding.config.paddingHorizontal + 20,
				backgroundColor: styles.theme.colors[activeTheme].screen_background,
				paddingBottom: 130
			}}
		>
			<Animated.View
				entering={staggerCardAnimation(1)}
				style={{
					display: 'flex',
					alignItems: 'center',
					marginTop: top + 40,
					marginBottom: 20
				}}
			>
				<AiUser color={styles.theme.colors.primary} size={styles.icon.size.xl * 6} />
			</Animated.View>

			<Animated.View
				entering={staggerCardAnimation(2)}
				style={{ display: 'flex', alignItems: 'center', rowGap: 8 }}
			>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.semi_bold,
						fontSize: styles.font.size.lg,
						color: styles.theme.colors.primary,
						textAlign: 'center'
					}}
				>
					Let's Personalize Your Experience
				</Text>

				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					Help us understand your unique beauty profile
				</Text>
			</Animated.View>

			<Animated.Text
				entering={staggerCardAnimation(3)}
				style={{
					fontSize: styles.font.size.md,
					fontFamily: styles.font.family,
					marginTop: styles.spacing.double_xxl,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				To provide you with a profile-based ingredient analysis, we need to understand
				your general skin and hair traits.
			</Animated.Text>

			{/* <View style={{ rowGap: 20, marginTop: 25 }}>
				<Animated.View entering={staggerCardAnimation(4)} style={STYLES.card}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.semi_bold,
							fontSize: styles.font.size.lg,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{initialStepSchema[0].name}
					</Text>
					<View style={{ rowGap: 4 }}>
						{initialStepSchema[0].items.map((item) => (
							<View key={item} style={STYLES.cardItemStyle}>
								<Circle size={6} fill={Colors.primary} strokeWidth={0} />
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{item}
								</Text>
							</View>
						))}
					</View>
				</Animated.View>

				<Animated.View entering={staggerCardAnimation(5)} style={STYLES.card}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.semi_bold,
							fontSize: styles.font.size.lg,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{initialStepSchema[1].name}
					</Text>
					<View style={{ rowGap: 4 }}>
						{initialStepSchema[1].items.map((item) => (
							<View key={item} style={STYLES.cardItemStyle}>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									✗ {item}
								</Text>
							</View>
						))}
					</View>
				</Animated.View>
			</View> */}

			<Animated.View
				entering={staggerCardAnimation(4)}
				style={{
					backgroundColor: styles.theme.colors[activeTheme].card_background,
					borderWidth: 1,
					borderColor: styles.theme.colors[activeTheme].card_border,
					borderRadius: styles.border.radius.size.sm,
					padding: styles.spacing.one_xl,
					marginTop: 18,
					rowGap: styles.spacing.md
				}}
			>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.bold,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					{medical_disclaimer_schema.title}
				</Text>

				<View style={{ rowGap: styles.spacing.double_xl }}>
					{medical_disclaimer_schema.disclaimers.map((disclaimer) => (
						<Text
							key={disclaimer}
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{disclaimer}
						</Text>
					))}
				</View>
			</Animated.View>

			<Animated.View entering={staggerCardAnimation(5)}>
				<TouchableOpacity
					onPress={() => setIsInitialStepButtonActive(!isInitialStepButtonActive)}
					style={{ flexDirection: 'row', columnGap: 6, marginTop: 20 }}
					activeOpacity={0.5}
				>
					<Checkbox
						value={!isInitialStepButtonActive}
						color={!isInitialStepButtonActive ? Colors.primary : undefined}
						style={{
							aspectRatio: 1,
							width: 15,
							pointerEvents: 'none',
							borderRadius: 4,
							marginTop: 4
						}}
					/>

					<View>
						<Text
							style={{
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								paddingRight: 20
							}}
						>
							I understand that BeauWise is an educational tool and not a substitute for
							professional medical advice.
						</Text>
					</View>
				</TouchableOpacity>
			</Animated.View>
		</ScrollView>
	);
}

const STYLES = StyleSheet.create({
	card: {
		rowGap: 8,
		borderRadius: 12
	},

	cardItemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 6
	}
});
