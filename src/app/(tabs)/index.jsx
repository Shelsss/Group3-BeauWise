import Card from '@/components/home/Card';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Colors from '@/constants/Colors';

import { router, useRouter } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';
import { useAuthStore } from '@/stores/useAuthStore';
import ShieldCheck2 from '@/components/icons/hugeicons/ShieldCheck';
import InputNumeric from '@/components/icons/hugeicons/InputNumeric';
import Lock2 from '@/components/icons/hugeicons/Lock2';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { getInnerRadius } from '@/utility/getInnerRadius';
import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import Metrics from '@/components/home/Metrics';
import RecentAnalysis from '@/components/home/RecentAnalysis';

const ROW_SPACING = 30;

const homeSchema = [
	{
		sectionTitle: 'Smart Tools',
		cards: [
			{
				headerContent: 'Batch Code Lookup',
				footerContent: 'Check product freshness',
				icon: (size) => <InputNumeric size={size} color={styles.theme.colors.batch} />,
				navigationTarget: '/batch'
			},
			{
				headerContent: 'FDA Product Verifier',
				footerContent: 'Confirm regulatory compliance',
				icon: (size) => <ShieldCheck2 size={size} color={styles.theme.colors.fda} />,
				navigationTarget: '/fda'
			}
		]
	}
];

export default function HomeScreen() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const route = useRouter();

	const handleNavigate = (routeName) => () => {
		route.push(routeName);
	};

	return (
		<>
			<CustomHeader title={'BeauWise'} />
			<View
				style={{
					position: 'absolute',
					width: '100%',
					top: 110,
					paddingHorizontal: styles.spacing.one_xl
				}}
			>
				{isAuthenticated && <Metrics />}

				<View
					style={{
						rowGap: 4,
						marginTop: ROW_SPACING
					}}
				>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.lg,
							fontWeight: styles.font.weight.bold,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{homeSchema[0].sectionTitle}
					</Text>
					<View style={{ rowGap: 8 }}>
						{homeSchema[0].cards.map((card, index) => (
							<Card
								handleNavigate={handleNavigate(card.navigationTarget)}
								key={index}
								containerStyle={{
									backgroundColor:
										card.navigationTarget === '/fda'
											? styles.theme.colors[activeTheme].fda_background
											: styles.theme.colors[activeTheme].batch_background,

									borderWidth: 1,
									borderColor:
										card.navigationTarget === '/fda'
											? styles.theme.colors[activeTheme].fda_border
											: styles.theme.colors[activeTheme].batch_border,
									flexDirection: 'row',
									alignItems: 'center',
									padding: styles.spacing.xl
								}}
							>
								<View style={{ marginLeft: styles.spacing.md }}>
									{card.icon(styles.icon.size.xl * 1.2)}
								</View>

								<View style={{ marginLeft: styles.spacing.xl }}>
									<Text
										style={{
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md,
											fontWeight: styles.font.weight.bold,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{card.headerContent}
									</Text>
									<Text
										style={{
											fontFamily: styles.font.family,
											fontSize: styles.font.size.xs,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{card.footerContent}
									</Text>
								</View>

								<View
									style={{
										marginLeft: 'auto',
										marginRight: styles.spacing.md
									}}
								>
									<ArrowRight
										size={styles.icon.size.lg}
										color={styles.theme.colors[activeTheme].icon}
									/>
								</View>
							</Card>
						))}
					</View>
				</View>

				{isAuthenticated && (
					<View style={{ marginTop: ROW_SPACING, rowGap: 6 }}>
						<RecentAnalysis />
					</View>
				)}

				{!isAuthenticated && (
					<View
						style={[
							{
								marginTop: ROW_SPACING,
								alignItems: 'center',
								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.double_xl,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border
							}
						]}
					>
						<View
							style={{
								rowGap: styles.spacing.xl,

								borderRadius: getInnerRadius(
									styles.border.radius.size.md,
									styles.spacing.double_xl
								)
							}}
						>
							<View style={{ alignItems: 'center', marginBottom: styles.spacing.lg }}>
								<Lock2 color={styles.theme.colors.primary} size={30} />
							</View>

							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.md,
									fontWeight: styles.font.weight.bold,
									textAlign: 'center',
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Personalize Your Experience
							</Text>
							<Text
								style={{
									width: 260,
									fontSize: styles.font.size.sm,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text,
									textAlign: 'center'
								}}
							>
								Sign up to match ingredients against your unique skin and hair profile,
								save your daily scan history, and easily track your products.
							</Text>

							<TouchableOpacity
								onPress={() => router.push('authentication/sign-in')}
								activeOpacity={0.7}
								style={{
									marginTop: styles.spacing.lg,
									justifyContent: 'center',
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: Colors.primary,
									padding: 14,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										fontWeight: styles.font.weight.bold,
										color: styles.font.colors._04
									}}
								>
									Create Account
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</>
	);
}
