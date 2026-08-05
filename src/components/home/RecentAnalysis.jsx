import { getDocumentFilterToday } from '@/utility/queries';
import { useQuery } from '@tanstack/react-query';
import { Text, useColorScheme, View } from 'react-native';
import HistoryCard from '../history/Card';
import { router } from 'expo-router';
import Skeleton from '../Skeleton';
import styles from '@/config/styles';
import RetryError from '../RetryError';
import { useThemeStore } from '@/stores/useThemeStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import Archive from '../icons/hugeicons/Archive';
import { useNetInfo } from '@react-native-community/netinfo';
export default function RecentAnalysis() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const { data, refetch, isError, isRefetchError, isLoading } = useQuery({
		queryKey: ['recent-analysis'],

		queryFn: async () => {
			const recentAnalysis = await getDocumentFilterToday('analysis_history').call();

			return [...recentAnalysis.toReversed().filter((_, index) => index <= 2)];
		}
	});

	return isError || isRefetchError ? (
		<RetryError refetch={refetch} />
	) : isLoading ? (
		<View style={{ rowGap: 8 }}>
			{[...Array(3)].map((_, index) => (
				<Skeleton
					key={index}
					width={'100%'}
					height={56}
					borderRadius={styles.border.radius.size.md}
				/>
			))}
		</View>
	) : (
		<View style={{ rowGap: 8 }}>
			<Text
				style={{
					fontFamily: styles.font.family,
					fontSize: styles.font.size.lg,
					fontWeight: styles.font.weight.bold,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				Recent Analysis
			</Text>

			{data.length <= 0 && (
				<Animated.View
					entering={FadeIn}
					style={{
						alignItems: 'center',
						marginTop: styles.spacing.double_xl
					}}
				>
					<Archive color={styles.theme.colors[activeTheme].icon} />
					<Text
						style={{
							marginTop: styles.spacing.md,
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.light,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						No Active Analyses
					</Text>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.light,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text_secondary,
							textAlign: 'center'
						}}
					>
						Your generated reports will appear here. Run your first analysis to get
						started.
					</Text>
				</Animated.View>
			)}

			{data.map((item) => {
				const onPress = () =>
					router.navigate({
						pathname: '/history/preview',
						params: {
							type: 'analysis',
							data: JSON.stringify(item)
						}
					});

				const secondaryText = item?.analysis_check_date;

				return (
					<HistoryCard
						key={item.product?.name}
						onPress={onPress}
						type='analysis'
						title={item?.product?.name}
						secondaryText={secondaryText}
					/>
				);
			})}
		</View>
	);
}
