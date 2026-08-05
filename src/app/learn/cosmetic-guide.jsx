import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { LegendList } from '@legendapp/list';
import { router } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import {
	FlatList,
	RefreshControl,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View
} from 'react-native';

import Card from '@/components/learn/awareness/Card';
import { useRef, useState } from 'react';
import Animated, {
	Extrapolation,
	FadeIn,
	FadeOut,
	interpolate,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import MythFactDetail from '@/components/learn/myths/Foo';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where
} from '@react-native-firebase/firestore';
import { db } from '@/services/firestore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearch } from '@/hooks/useSearch';
import { useDebouncedCallback } from 'use-debounce';
import RetryError from '@/components/RetryError';
import Skeleton from '@/components/Skeleton';
import { FlashList } from '@shopify/flash-list';
import { onScroll } from '@/utility/scrollView';

const fetchGuides = async ({ pageParam }) => {
	let q = query(
		collection(db, 'consumer_guides'),
		where('is_deleted', '==', false),
		limit(10)
	);

	if (pageParam) {
		q = query(q, startAfter(pageParam));
	}

	const snapshot = await getDocs(q);
	const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

	const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

	return { data, lastVisibleDoc };
};

export default function CosmeticGuide() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		isRefetchError,
		refetch
	} = useInfiniteQuery({
		queryKey: ['myths-facts'],
		queryFn: fetchGuides,
		initialPageParam: null,
		getNextPageParam: (lastPage) => {
			return lastPage.lastVisibleDoc || null;
		}
	});

	const [query, setQuery] = useState('');

	const scrollRef = useRef(null);

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const formattedData = data?.pages.flatMap((item) => item.data) ?? [];

	const search = useSearch(formattedData, ['name'], query, true);

	const formatSearched = () => {
		if (search.length <= 0) return;

		return search.map(({ item }) => ({ ...item }));
	};

	const formatData = () => {
		return search?.length > 0 ? formatSearched() : formattedData;
	};

	const delaySearch = useDebouncedCallback((val) => setQuery(val), 220);

	return (
		<>
			<View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: 15,
					paddingTop: 62,
					paddingBottom: styles.spacing.double_xl,
					rowGap: styles.spacing.one_xl
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
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
							Learn
						</Text>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.light,
								color: styles.font.colors._04
							}}
						>
							Cosmetic Label Guide
						</Text>
					</View>
				</View>

				<View
					style={{
						borderRadius: styles.border.radius.size.sm,
						backgroundColor: styles.theme.colors[activeTheme].input_background,
						paddingHorizontal: styles.spacing.xl,
						alignItems: 'center',
						flexDirection: 'row',
						columnGap: styles.spacing.md
					}}
				>
					<Search
						color={styles.theme.colors[activeTheme].text + '9a'}
						size={styles.icon.size.xl}
					/>
					<TextInput
						onChangeText={(val) => delaySearch(val)}
						placeholder='Search...'
						placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
						selectTextOnFocus={true}
						selectionColor={styles.theme.colors.primary}
						cursorColor={styles.theme.colors.primary}
						clearTextOnFocus={true}
						enterKeyHint='done'
						style={{
							flexGrow: 1,
							color: styles.theme.colors[activeTheme].text,
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md
						}}
					/>
				</View>
			</View>

			{isLoading ? (
				<View
					style={{
						flex: 1,
						marginTop: styles.spacing.double_xl,
						paddingHorizontal: styles.spacing.double_xxl,
						rowGap: styles.spacing.one_xl
					}}
				>
					{[...Array(8)].map((_, index) => {
						return (
							<Skeleton
								key={index}
								width={'100%'}
								height={60}
								borderRadius={styles.border.radius.size.md}
							/>
						);
					})}
				</View>
			) : isError || isRefetchError ? (
				<View style={{ flex: 1 }}>
					<RetryError refetch={refetch} />
				</View>
			) : (
				<FlashList
					ref={scrollRef}
					onScroll={onScroll(scrollRef)}
					contentContainerStyle={{
						margin: styles.spacing.one_xxl,
						paddingBottom: styles.spacing.three_xxl * 2.8
					}}
					onEndReachedThreshold={0.7}
					onEndReached={() => {
						if (hasNextPage) fetchNextPage();
					}}
					keyExtractor={(item) => item.id}
					data={formatData()}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => (
						<View style={{ height: styles.spacing.one_xl }} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={isLoading}
							onRefresh={() => refetch()}
							progressBackgroundColor={styles.theme.colors[activeTheme].card_background}
							colors={[styles.theme.colors.primary]}
						/>
					}
					onRefresh={refetch}
					renderItem={({ item, target, index }) => {
						const onPress = () => {
							router.push({
								pathname: '/learn/cosmetic-details',
								params: {
									item: JSON.stringify(item)
								}
							});
						};

						return (
							<Card
								name={item.name}
								description={item.definition}
								id={item.id}
								onPress={onPress}
							/>
						);
					}}
				/>
			)}
		</>
	);
}
