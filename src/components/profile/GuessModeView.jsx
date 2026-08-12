import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import CreateAccountButton from '../CreateAccountButton';
import { router } from 'expo-router';
import Analysis from '@/components/icons/hugeicons/Analysis';
import Transaction from '@/components/icons/hugeicons/Transaction';
import Dashboard from '@/components/icons/hugeicons/Dashboard';
import Robot from '@/components/icons/hugeicons/Robot';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import Profile2Solid from '@/components/icons/hugeicons/Profile2Solid';

const guessModeSchema = {
	accountFeatures: [
		{
			title: 'Profile-Based Analysis',
			description: 'Get ingredient filtering based on your saved cosmetic profile.',
			icon: (color, size) => <Analysis color={color} size={size} />
		},

		{
			title: 'Full Scan History',
			description: 'Review every product analysis you have made in one convenient place.',
			icon: (color, size) => <Transaction color={color} size={size} />
		},

		{
			title: 'Educational Dashboard',
			description:
				'Track your scan counts, verified FDA notifications, and most frequently matched ingredients.',
			icon: (color, size) => <Dashboard color={color} size={size} />
		},

		{
			title: 'Smart Ingredient Matching',
			description:
				'AI powered categorization based on established cosmetic literature and guidelines.',
			icon: (color, size) => <Robot color={color} size={size} />
		}
	],

	notAskedFor: [
		`We don't collect sensitive medical information`,
		`We don't require diagnosis or health records`,
		`We don't ask for payment information upfront`,
		`We don't track your location`
	],

	note: 'BeauWise is strictly an educational tool for cosmetic ingredient analysis. It does not diagnose, treat, or replace professional medical advice, and its analyses have no approved therapeutic claims. Always consult a board-certified dermatologist for skin conditions or medical concerns.'
};

export default function GuessModeView() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	return (
		<View
			style={{
				flex: 1,
				paddingBottom: 80,
				rowGap: 20
			}}
		>
			<View
				style={{
					alignSelf: 'center',
					borderWidth: 0.5,
					borderColor: styles.theme.colors[activeTheme].card_border,
					backgroundColor: styles.theme.colors[activeTheme].card_background,
					padding: 14,
					borderRadius: 100
				}}
			>
				<Profile2Solid size={30} color={styles.theme.colors.primary} />
			</View>

			<View>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.xl,
						fontWeight: styles.font.weight.bold,
						color: styles.theme.colors[activeTheme].text,
						textAlign: 'center'
					}}
				>
					Guest Mode
				</Text>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text_secondary,
						textAlign: 'center'
					}}
				>
					You're currently using BeauWise as a guest.
				</Text>
			</View>

			<View
				style={[
					{
						padding: styles.spacing.double_xl,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderRadius: styles.border.radius.size.sm,
						rowGap: styles.spacing.double_xl
					}
				]}
			>
				<Text
					style={{
						fontSize: styles.font.size.md,
						color: styles.theme.colors.primary,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.bold
					}}
				>
					Unlock Full Features
				</Text>

				<View style={{ rowGap: styles.spacing.one_xxl }}>
					{guessModeSchema.accountFeatures.map(({ title, description, icon }) => (
						<View
							key={title}
							style={{ flexDirection: 'row', columnGap: styles.spacing.xl }}
						>
							<View
								style={{
									marginTop: 4,
									padding: 4,

									alignSelf: 'flex-start'
								}}
							>
								{icon(styles.theme.colors[activeTheme].icon + '9a', styles.icon.size.xl)}
							</View>

							<View>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										fontWeight: styles.font.weight.semi_bold,
										color: styles.theme.colors[activeTheme].text + '9a'
									}}
								>
									{title}
								</Text>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm,
										color: styles.theme.colors[activeTheme].text_secondary + '9a',
										marginRight: styles.spacing.three_xxl
									}}
								>
									{description}
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>
			<CreateAccountButton />

			<TouchableOpacity onPress={() => router.push('authentication/sign-in')}>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						color: styles.theme.colors.primary,
						textAlign: 'center'
					}}
				>
					Already have an account? Sign In
				</Text>
			</TouchableOpacity>

			<View style={{ rowGap: styles.spacing.sm, marginTop: styles.spacing.one_xl }}>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.bold,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					Safety Reminder
				</Text>
				<Text
					style={{
						fontSize: styles.font.size.sm,
						fontFamily: styles.font.family,

						color: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					{guessModeSchema.note}
				</Text>
			</View>
		</View>
	);
}
