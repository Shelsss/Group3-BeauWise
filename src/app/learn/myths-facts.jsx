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

import Card from '@/components/learn/myths/CardTwo';
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
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearch } from '@/hooks/useSearch';
import { useDebouncedCallback } from 'use-debounce';
import RetryError from '@/components/RetryError';
import Skeleton from '@/components/Skeleton';
import { ActivityIndicator } from 'react-native-paper';

const fetchMyths = async ({ pageParam }) => {
	let q = query(
		collection(db, 'myth_facts'),
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

export default function MythsFacts() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isRefetching,
		isError,
		isRefetchError,
		refetch
	} = useInfiniteQuery({
		queryKey: ['myths-facts'],
		queryFn: fetchMyths,
		initialPageParam: null,
		getNextPageParam: (lastPage) => {
			return lastPage.lastVisibleDoc || null;
		}
	});

	const [selectedItem, setSelectedItem] = useState(null);
	const [query, setQuery] = useState('');

	const scrollRef = useRef(null);
	const [visible, setVisible] = useState(false);

	const listAnimationDriver = useSharedValue(1);

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const showModule = () => setVisible(true);
	const hideModule = () => setVisible(false);

	const listAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			listAnimationDriver.value,
			[0, 1],
			[0, 1],
			Extrapolation.CLAMP
		);

		return {
			opacity
		};
	});

	const showList = () => (listAnimationDriver.value = withTiming(1, { duration: 700 }));
	const hideList = () => (listAnimationDriver.value = withTiming(0, { duration: 200 }));

	const onPressModule = (item) => () => {
		console.log(item);

		setSelectedItem(item);
		showModule();
		hideList();
	};

	const onBack = () => {
		setSelectedItem(null);
		showList();
		hideModule();
	};

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
			<Animated.View
				layout={LinearTransition.springify().damping(200)}
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
							if (visible) {
								onBack();
							} else {
								router.back();
							}
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
							Cosmetic Myths & Facts
						</Text>
					</View>
				</View>

				{!visible && (
					<Animated.View
						entering={FadeIn}
						exiting={FadeOut.duration(140)}
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
							placeholder='Search Modules...'
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
					</Animated.View>
				)}
			</Animated.View>

			{selectedItem && (
				<MythFactDetail
					selectedItem={selectedItem}
					activeTheme={activeTheme}
					onBack={onBack}
				/>
			)}

			{isRefetching ? (
				<View
					style={{
						flex: 1,
						marginTop: styles.spacing.double_xl,
						paddingHorizontal: styles.spacing.double_xxl,
						rowGap: styles.spacing.one_xl
					}}
				>
					{[...Array(2)].map((_, index) => {
						return (
							<View
								key={index}
								style={{
									flexDirection: 'row',
									columnGap: styles.spacing.one_xl
								}}
							>
								{[...Array(2)].map((_, index) => {
									return (
										<View key={index} style={{ flex: 1 }}>
											<Skeleton
												width={'100%'}
												height={220}
												borderRadius={styles.border.radius.size.sm}
											/>
										</View>
									);
								})}
							</View>
						);
					})}
				</View>
			) : isError || isRefetchError ? (
				<View style={{ flex: 1 }}>
					<RetryError refetch={refetch} />
				</View>
			) : (
				<Animated.View
					style={[
						{
							marginTop: '54%',
							zIndex: -1,
							position: 'absolute',
							width: '100%',
							height: '100%'
						},
						listAnimatedStyle
					]}
				>
					<LegendList
						showsVerticalScrollIndicator={false}
						ref={scrollRef}
						onScroll={({ nativeEvent }) => {
							if (nativeEvent.contentOffset.y < 0) {
								scrollRef.current?.scrollToOffset({ x: 0, y: 0 });
							}
						}}
						onEndReachedThreshold={0.3}
						keyExtractor={(item, index) => `${item.title}-${index}`}
						data={formatData()}
						refreshControl={
							<RefreshControl
								refreshing={isRefetching}
								onRefresh={() => refetch()}
								progressBackgroundColor={styles.theme.colors[activeTheme].card_background}
								colors={[styles.theme.colors.primary]}
							/>
						}
						renderItem={({ item }) => (
							<Card
								id={item?.id}
								onPress={onPressModule(item)}
								title={item?.name}
								baseImagePath={item.baseImagePath}
								cacheImageTag={item?.displayImage?.fileHash}
								numberOfTopics={item?.topics?.length}
							/>
						)}
						onEndReached={() => {
							if (hasNextPage) fetchNextPage();
						}}
						numColumns={2}
						contentContainerStyle={{
							gap: styles.spacing.one_xl,
							paddingBottom: 250,
							paddingHorizontal: styles.spacing.double_xxl
						}}
						ListHeaderComponentStyle={{ marginBottom: styles.spacing.double_xl }}
						ListFooterComponent={() => {
							return isFetchingNextPage && <ActivityIndicator />;
						}}
					/>
				</Animated.View>
			)}
		</>
	);
}

// <View
// 	style={{
// 		borderWidth: activeTheme === 'light' ? 1 : 0,
// 		borderColor:
// 			activeTheme === 'light'
// 				? styles.theme.colors.light.card_border
// 				: 'transparent',
// 		borderRadius: styles.border.radius.size.md,
// 		padding: styles.spacing.double_xl,
// 		backgroundColor: styles.theme.colors[activeTheme].card_background,
// 		flexDirection: 'row'
// 	}}
// >
// 	<View
// 		style={{
// 			flexGrow: 1,
// 			alignItems: 'center',
// 			rowGap: styles.spacing.sm
// 		}}
// 	>
// 		<Text
// 			style={{
// 				fontSize: styles.font.size.md,
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text,
// 				fontWeight: styles.font.weight.bold
// 			}}
// 		>
// 			15
// 		</Text>
// 		<Text
// 			style={{
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text_secondary,
// 				fontSize: styles.font.size.sm
// 			}}
// 		>
// 			Modules
// 		</Text>
// 	</View>

// 	<View
// 		style={{
// 			flexGrow: 1,
// 			alignItems: 'center',
// 			rowGap: styles.spacing.sm
// 		}}
// 	>
// 		<Text
// 			style={{
// 				fontSize: styles.font.size.md,
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text,
// 				fontWeight: styles.font.weight.bold
// 			}}
// 		>
// 			70+
// 		</Text>
// 		<Text
// 			style={{
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text_secondary,
// 				fontSize: styles.font.size.sm
// 			}}
// 		>
// 			Science-Backed Insights
// 		</Text>
// 	</View>

// 	<View
// 		style={{
// 			flexGrow: 1,
// 			alignItems: 'center',
// 			rowGap: styles.spacing.sm
// 		}}
// 	>
// 		<Text
// 			style={{
// 				fontSize: styles.font.size.md,
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text,
// 				fontWeight: styles.font.weight.bold
// 			}}
// 		>
// 			2–8 Min
// 		</Text>
// 		<Text
// 			style={{
// 				fontFamily: styles.font.family,
// 				color: styles.theme.colors[activeTheme].text_secondary,
// 				fontSize: styles.font.size.sm
// 			}}
// 		>
// 			Read Time
// 		</Text>
// 	</View>
// </View>;
