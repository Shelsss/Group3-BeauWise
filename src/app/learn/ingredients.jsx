import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';

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

import Card from '@/components/learn/ingredients-glossary/Card';
import { useRef, useState } from 'react';
import Animated, {
	Extrapolation,
	FadeIn,
	FadeInDown,
	FadeOut,
	interpolate,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import MythFactDetail from '@/components/learn/myths/CardList';
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
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useSearch } from '@/hooks/useSearch';
import { useDebouncedCallback } from 'use-debounce';
import RetryError from '@/components/RetryError';
import Skeleton from '@/components/Skeleton';
import { FlashList } from '@shopify/flash-list';
import { onScroll } from '@/utility/scrollView';
import { searchEngine } from '@/services/cloudFunctions';
import { ActivityIndicator } from 'react-native-paper';

const sections = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];
const fetchMyths = async ({ pageParam }) => {
	let q = query(
		collection(db, 'ingredients_glossary'),
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

export default function IngredientsGlossary() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		isRefetchError,
		refetch
	} = useInfiniteQuery({
		queryKey: ['ingredients-glossary'],
		queryFn: fetchMyths,
		initialPageParam: null,
		getNextPageParam: (lastPage) => {
			return lastPage.lastVisibleDoc || null;
		}
	});

	const searchQuery = useMutation({
		mutationFn: searchEngine,
		onSuccess: () => {
			setResultVisible(true);
		},

		onError: (e) => {}
	});

	const [resultVisible, setResultVisible] = useState(false);

	const scrollRef = useRef(null);

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const formattedData = data?.pages.flatMap((item) => item.data) ?? [];

	const formatToSection = () => {
		return sections.flatMap((section) => {
			const items = formattedData.filter((item) => {
				const itemInitialLetter = item.name[0];

				return itemInitialLetter.toLowerCase() === section.toLowerCase();
			});

			return [section, ...items];
		});
	};

	const delaySearch = useDebouncedCallback((val) => {
		if (val.length <= 0) {
			setResultVisible(false);
			return;
		}
		searchQuery.mutate({ query: val, collectionKey: 'ingredients' });
	}, 220);

	const section = formatToSection();

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
							A-Z Ingredient Glossary
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
							width: 260,
							color: styles.theme.colors[activeTheme].text,
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md
						}}
					/>
					{searchQuery.isPending && (
						<Animated.View
							entering={FadeIn}
							exiting={FadeOut.duration(120)}
							style={{ position: 'absolute', right: 14 }}
						>
							<ActivityIndicator
								size={styles.icon.size.xl}
								color={styles.theme.colors.primary}
							/>
						</Animated.View>
					)}
				</View>

				{resultVisible && (
					<Animated.View
						entering={FadeInDown}
						exiting={FadeOut.duration(120)}
						layout={LinearTransition.springify().damping(180)}
						style={{
							zIndex: 2,
							position: 'absolute',
							alignSelf: 'center',
							marginTop: '48%',
							borderRadius: styles.border.radius.size.sm,
							width: '100%',

							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].card_border
						}}
					>
						{searchQuery.data?.searchedData <= 0 ? (
							<View style={{ padding: styles.spacing.xxl }}>
								<Text
									style={{
										textAlign: 'center',
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									No results found. Try a different search term.
								</Text>
							</View>
						) : (
							searchQuery.data?.searchedData.map((ingredient, index) => {
								return (
									<Animated.View
										entering={FadeIn.delay(300)}
										key={ingredient.id}
										style={{ padding: styles.spacing.xxl }}
									>
										<TouchableOpacity
											onPress={() =>
												router.push({
													pathname: '/learn/ingredient-details',
													params: {
														item: JSON.stringify(ingredient)
													}
												})
											}
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													color:
														index === 0
															? styles.theme.colors.primary
															: styles.theme.colors[activeTheme].text,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md
												}}
											>
												{ingredient?.name}
											</Text>

											{index === 0 && (
												<Text
													style={{
														color: styles.theme.colors[activeTheme].text_secondary,
														marginLeft: 'auto',
														fontFamily: styles.font.family,
														fontSize: styles.font.size.xs
													}}
												>
													Suggested
												</Text>
											)}
										</TouchableOpacity>
									</Animated.View>
								);
							})
						)}
					</Animated.View>
				)}
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
								height={54}
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
				<View style={{ flex: 1 }}>
					<FlashList
						ref={scrollRef}
						onScroll={onScroll(scrollRef)}
						contentContainerStyle={{
							margin: styles.spacing.one_xxl,
							paddingBottom: styles.spacing.three_xxl * 2.2
						}}
						onEndReachedThreshold={0.7}
						onEndReached={() => {
							if (hasNextPage) fetchNextPage();
						}}
						keyExtractor={(item) => item.id}
						data={section}
						showsVerticalScrollIndicator={false}
						ItemSeparatorComponent={() => (
							<View style={{ height: styles.spacing.one_xl }} />
						)}
						getItemType={(item) => {
							return typeof item === 'string' ? 'sectionHeader' : 'row';
						}}
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
									pathname: '/learn/ingredient-details',
									params: {
										item: JSON.stringify(item)
									}
								});
							};

							const isSticky = target === 'StickyHeader';

							return (typeof item === 'string' || item === 'Z') &&
								typeof section[index + 1] !== 'string' ? (
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
											fontSize: styles.font.size.one_xl,
											fontFamily: styles.font.family,
											textTransform: 'uppercase',
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{item}
									</Text>
								</Animated.View>
							) : typeof item === 'object' ? (
								<Card onPress={onPress} name={item.name} categories={item.categories} />
							) : null;
						}}
					/>
				</View>
			)}
		</>
	);
}
