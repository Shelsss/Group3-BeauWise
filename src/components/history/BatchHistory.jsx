import { useHistoryStore } from '@/stores/useHistoryStore';
import historyQuery from '@/utility/historyQuery';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { RefreshControl, Text, useColorScheme, View } from 'react-native';
import Card from '@/components/history/Card';
import styles from '@/config/styles';
import { isToday, isYesterday, parse } from 'date-fns';
import { useThemeStore } from '@/stores/useThemeStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

import { useSearch } from '@/hooks/useSearch';
import historyTabs from '@/utility/historyTabs';
import Skeleton from '../Skeleton';
import Archive from '../icons/hugeicons/Archive';
import RetryError from '../RetryError';

const emptyHistoryStates = {
	all_time: {
		title: 'No History Recorded Yet',
		description:
			'Your recent activities will appear here once you start using the service.'
	},

	default: {
		title: 'No Results Found',
		description: "We couldn't find any history matching your current filters."
	}
};

export default function BatchHistory() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const filter = useHistoryStore((state) => state.filter);
	const currentIndex = useHistoryStore((state) => state.index);
	const query = useHistoryStore((state) => state.query);
	const indexOfBatch = historyTabs.indexOf(
		historyTabs.find(({ key }) => key === 'batch_history')
	);
	const queryFn = historyQuery.find(({ field }) => field === filter).queryFn;
	const enabled = currentIndex === indexOfBatch;

	const { data, isPending, isError, refetch, isRefetchError } = useQuery({
		queryKey: ['batch_history', `batch_history_${filter}`],
		queryFn: queryFn('batch_history'),
		enabled
	});

	const search = useSearch(data, ['brand'], query, enabled);

	const formatToSection = () => {
		const sections = ['today', 'yesterday', 'past months'];

		const sectionFormat = sections.reduce((acc, cur) => {
			acc.push(cur);

			data?.forEach((item) => {
				const itemDate = parse(
					item.verification_check_date,
					"MMMM d',' yyyy 'at' p",
					new Date()
				);

				if (cur === 'today' && isToday(itemDate)) {
					acc.push(item);
					return;
				}

				if (cur === 'yesterday' && isYesterday(itemDate)) {
					acc.push(item);
					return;
				}

				if (cur === 'past months' && !isYesterday(itemDate) && !isToday(itemDate)) {
					acc.push(item);
					return;
				}
			});

			return acc;
		}, []);

		return sectionFormat;
	};

	const formatSearched = () => {
		if (search.length <= 0) return;

		return search.map(({ item }) => ({ ...item }));
	};

	const formatData = () => {
		return search?.length > 0
			? formatSearched()
			: filter === 'all_time'
				? formatToSection()
				: data;
	};

	const stickyHeaderIndices = () => {
		if (filter === 'all_time') {
			return formatData()
				.map((item, index) => {
					if (typeof item === 'string') {
						return index;
					} else {
						return null;
					}
				})
				.filter((item) => item !== null);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{isError || isRefetchError ? (
				<View style={{ flex: 1 }}>
					<RetryError refetch={refetch} />
				</View>
			) : data?.length <= 0 ? (
				<Animated.View
					entering={FadeIn}
					style={{
						marginTop: '54%',
						flex: 1,
						alignItems: 'center'
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
						{filter === 'all_time'
							? emptyHistoryStates[filter].title
							: emptyHistoryStates.default.title}
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
						{filter === 'all_time'
							? emptyHistoryStates[filter].description
							: emptyHistoryStates.default.description}
					</Text>
				</Animated.View>
			) : isPending ? (
				<View
					style={{
						padding: styles.spacing.one_xl,
						overflow: 'hidden',
						gap: styles.spacing.one_xl
					}}
				>
					{[...Array(6)].map((_, index) => (
						<Skeleton
							key={index}
							width={'100%'}
							height={56}
							borderRadius={styles.border.radius.size.md}
						/>
					))}
				</View>
			) : (
				<FlashList
					refreshControl={
						<RefreshControl
							refreshing={isPending}
							onRefresh={() => refetch()}
							progressBackgroundColor={styles.theme.colors[activeTheme].card_background}
							colors={[styles.theme.colors.primary]}
						/>
					}
					style={{
						padding: styles.spacing.one_xl
					}}
					contentContainerStyle={{
						paddingBottom: styles.spacing.three_xxl * 2.2
					}}
					data={formatData()}
					StickyHeaderComponent={() => <View style={{ backgroundColor: 'red' }} />}
					showsVerticalScrollIndicator={false}
					stickyHeaderIndices={stickyHeaderIndices()}
					ItemSeparatorComponent={() => (
						<View style={{ height: styles.spacing.one_xl }} />
					)}
					getItemType={(item) => {
						return typeof item === 'string' ? 'sectionHeader' : 'row';
					}}
					renderItem={({ item, target }) => {
						const onPress = () =>
							router.navigate({
								pathname: '/history/preview',
								params: {
									type: 'batch',
									data: JSON.stringify(item)
								}
							});

						const isSticky = target === 'StickyHeader';

						const secondaryText = item?.is_expired
							? 'Estimated Shelf Life Expired'
							: item?.is_invalid
								? 'Invalid Code or Not Found'
								: 'Freshness Verified';

						const secondaryTextColor = item?.is_expired
							? styles.theme.colors.status.red
							: item?.is_invalid
								? styles.theme.colors.status.yellow
								: styles.theme.colors.status.green;

						return typeof item === 'string' ? (
							<Animated.View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									columnGap: styles.spacing.lg,
									padding: isSticky ? styles.spacing.xxl + 2 : 0
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										textTransform: 'uppercase',
										color: styles.theme.colors[activeTheme].text + '9a'
									}}
								>
									{item}
								</Text>
								<View
									style={{
										flexGrow: 1,
										height: 1,
										borderRadius: styles.border.radius.size.pill,
										backgroundColor: styles.theme.colors[activeTheme].seperator
									}}
								/>
							</Animated.View>
						) : (
							<Card
								onPress={onPress}
								type='batch'
								title={item?.brand}
								secondaryText={secondaryText}
								secondaryTextColor={secondaryTextColor}
							/>
						);
					}}
				/>
			)}
		</View>
	);
}
