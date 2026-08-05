import { ScrollView, Text, useColorScheme, View } from 'react-native';
import CreateAccountButton from '../CreateAccountButton';
import { Check } from 'lucide-react-native';
import PagePadding from '@/constants/PagePadding';
import { useRef } from 'react';
import FolderLock from '@/components/icons/hugeicons/FolderLock';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';

const guessModeSchema = {
	title: 'No Saved History',
	description:
		'In Guest Mode, your product scans, FDA registry checks, and batch code verifications are not saved. Create an account to keep a permanent log of all your analyses.',
	accountBenefits: [
		{
			title: 'Save All Your Analyses',
			description:
				'Keep a complete, organized record of every cosmetic label you scan, along with your FDA and batch code results.'
		},

		{
			title: 'Review Ingredient Breakdowns',
			description:
				'Instantly access past ingredient lists and clearly see which components need your attention.'
		},

		{
			title: 'Unlock Profile-Based Filtering',
			description:
				'Cross-reference cosmetic ingredients with standard safety literature based on your general skin and hair traits.'
		}
	],
	limitation:
		'In Guest Mode, scans are temporary and cleared when you close the app. Sign up to unlock full history tracking and personalization features.'
};
export default function GuestModeView() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const scrollViewRef = useRef(null);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			contentContainerStyle={{
				paddingHorizontal: 20,
				paddingTop: PagePadding.config.paddingTop + 20,
				paddingBottom: PagePadding.config.paddingBottom
			}}
		>
			<View
				style={{
					alignSelf: 'center',
					padding: 20,
					borderRadius: 100
				}}
			>
				<FolderLock size={70} color={styles.theme.colors.primary} />
			</View>

			<View style={{ alignItems: 'center', marginTop: 20 }}>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.xl,
						fontWeight: styles.font.weight.bold,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					{guessModeSchema.title}
				</Text>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md,
						color: styles.theme.colors[activeTheme].text_secondary + '9a',
						textAlign: 'center',
						lineHeight: 22,
						width: '80%'
					}}
				>
					{guessModeSchema.description}
				</Text>
			</View>

			<View
				style={{
					borderColor: styles.theme.colors[activeTheme].card_border,
					backgroundColor: styles.theme.colors[activeTheme].card_background,
					borderWidth: 1,
					borderRadius: styles.border.radius.size.sm,
					rowGap: styles.spacing.double_xl,
					padding: styles.spacing.double_xl,
					marginVertical: styles.spacing.double_xxl
				}}
			>
				{guessModeSchema.accountBenefits.map(({ title, description }) => (
					<View key={title} style={{ flexDirection: 'row', columnGap: 12 }}>
						<View
							style={{
								marginTop: 4,
								backgroundColor: '#20C9971a',
								padding: 4,
								borderRadius: 100,
								alignSelf: 'flex-start'
							}}
						>
							<Check size={12} color={'#20C997'} />
						</View>

						<View
							style={{
								rowGap: styles.spacing.sm
							}}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{title}
							</Text>
							<Text
								style={{
									fontSize: styles.font.size.sm,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text_secondary,
									paddingRight: styles.spacing.double_xxl
								}}
							>
								{description}
							</Text>
						</View>
					</View>
				))}
			</View>

			<CreateAccountButton />

			<View
				style={{
					rowGap: styles.spacing.sm,
					marginTop: styles.spacing.double_xxl
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
					Guess Mode Limitations
				</Text>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						color: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					{guessModeSchema.limitation}
				</Text>
			</View>
		</ScrollView>
	);
}
