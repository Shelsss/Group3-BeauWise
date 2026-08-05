import PagePadding from '@/constants/PagePadding';
import { useCallback, useRef, useState } from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import {
	collection,
	getDocs,
	query,
	documentId,
	orderBy,
	limit,
	startAfter
} from '@react-native-firebase/firestore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LegendList } from '@legendapp/list';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import Card from '@/components/learn/ingredients-glossary/Card';
import CardMyths from '@/components/learn/myths/Card';
import CardAwareness from '@/components/learn/awareness/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonCard from '@/components/learn/ingredients-glossary/SkeletonCard';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/Colors';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { searchEngine } from '@/services/cloudFunctions';
import { Swing } from 'react-native-animated-spinkit';
import BatchHeader from '@/components/batch/Header';
import { db } from '@/services/firestore';

const sectionListData = [
	{
		title: 'A',
		data: []
	},

	{
		title: 'B',
		data: []
	},

	{
		title: 'C',
		data: []
	},

	{
		title: 'D',
		data: []
	},

	{
		title: 'E',
		data: []
	},

	{
		title: 'F',
		data: []
	},

	{
		title: 'G',
		data: []
	},

	{
		title: 'H',
		data: []
	},

	{
		title: 'I',
		data: []
	},

	{
		title: 'J',
		data: []
	},

	{
		title: 'K',
		data: []
	},

	{
		title: 'L',
		data: []
	},

	{
		title: 'M',
		data: []
	},

	{
		title: 'N',
		data: []
	},

	{
		title: 'O',
		data: []
	},

	{
		title: 'P',
		data: []
	},

	{
		title: 'Q',
		data: []
	},

	{
		title: 'R',
		data: []
	},

	{
		title: 'S',
		data: []
	},

	{
		title: 'T',
		data: []
	},

	{
		title: 'U',
		data: []
	},

	{
		title: 'V',
		data: []
	},

	{
		title: 'W',
		data: []
	},

	{
		title: 'X',
		data: []
	},

	{
		title: 'Y',
		data: []
	},

	{
		title: 'Z',
		data: []
	}
];

export default function Index() {
	const [queryResult, setQueryResult] = useState(null);

	const { category } = useLocalSearchParams();
	const { bottom } = useSafeAreaInsets();

	const currentCategory = category.match(/\[(.*?)\]/)[1];

	const currentRoute = category
		.match(/\[(.*?)\]/)[1]
		.split('_')
		.map((string) => string.charAt(0).toUpperCase() + string.slice(1))
		.join(' ');
	const scrollViewRef = useRef(null);
	const collectionRef = collection(db, currentCategory);

	const fetchData = useCallback(async (pageParam) => {
		const queryOption = query(
			collectionRef,
			orderBy(documentId()),
			limit(10),
			...(pageParam ? [startAfter(pageParam)] : [])
		);

		const documentSnapshots = await getDocs(queryOption);

		const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

		return {
			data: documentSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
			nextCursor: lastVisible
		};
	}, []);

	const { data, isPending, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: [currentCategory],
			enabled: currentCategory === 'myths_facts' ? false : true,
			staleTime: 1000 * 60 * 5,
			gcTime: 2000 * 60 * 5,
			queryFn: ({ pageParam }) => fetchData(pageParam),
			initialPageParam: null,
			getNextPageParam: (lastPage) => {
				return lastPage.nextCursor?.id ? lastPage.nextCursor?.id : null;
			}
		});

	const renderFooterComponent = useCallback(
		() => (isFetchingNextPage ? <SkeletonCard /> : null),
		[isFetchingNextPage]
	);

	const renderItem = useCallback(
		({ item }) => {
			if (currentCategory === 'ingredients_glossary') {
				return (
					<Card
						id={item.id}
						title={item.ingredient_name?.replace(/\s*[/(\[].*/, '')}
						categories={item.categories}
						category={currentCategory}
					/>
				);
			}

			if (currentCategory === 'consumer_awareness') {
				return (
					<CardAwareness
						item={item}
						id={item.id}
						myths={item.topics}
						title={item.symbol_name}
						description={item.definition}
						category={currentCategory}
						imageSource={item.image_url}
					/>
				);
			}

			if (currentCategory === 'myths_facts') {
				return (
					<CardMyths
						id={item.id}
						mythSource={{ name: item.source_name, sources: item.source_urls }}
						myths={item.topics}
						category={currentCategory}
						title={item.section_title}
						description={item.section_description}
						imageSource={item.image_url}
					/>
				);
			}
		},
		[currentCategory]
	);

	const estimatedItemSize = useCallback(() => {
		return currentCategory === 'myths_facts'
			? 600
			: currentCategory === 'ingredient_glossary'
				? 100
				: 120;
	}, [currentCategory]);

	const handleEndReached = useCallback(async () => {
		if (hasNextPage && !isFetchingNextPage) {
			await fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	let dataList = data?.pages.flatMap((page) => page.data) ?? [];

	if (currentCategory === 'ingredients_glossary') {
		dataList.map((item) => {
			const initialChar = item.ingredient_name[0];

			const sectionIndex = sectionListData.findIndex(
				({ title }) => title === initialChar
			);

			// sectionListData[sectionIndex].data = [...sectionListData[sectionIndex].data, item];
		});
	}

	const handleQuery = (searchQuery) => async () => {
		if (searchQuery.length <= 0) {
			closeQueryResults();
			return;
		}

		const searchResults = await searchEngine(searchQuery);

		setQueryResult(searchResults);
		showQueryResults();
	};

	const queryResultOpacity = useSharedValue(0);
	const queryResultTransform = useSharedValue(0);

	const showQueryResults = () => {
		queryResultOpacity.value = 0;
		queryResultTransform.value = -5;

		queryResultOpacity.value = withTiming(1, { duration: 300 });
		queryResultTransform.value = withTiming(0, { duration: 400 });
	};

	const closeQueryResults = () => {
		queryResultOpacity.value = withTiming(0, { duration: 300 });
		queryResultTransform.value = withTiming(-5, { duration: 400 });
	};

	const animatedQueryResult = useAnimatedStyle(() => {
		return {
			opacity: queryResultOpacity.value,
			transform: [{ translateY: queryResultTransform.value }],
			zIndex: queryResultOpacity.value === 0 ? 1 : 2
		};
	});

	if (currentCategory === 'myths_facts') {
		return <Redirect href={'/learn/myths-facts'} />;
	}

	return (
		<>
			{isPending ? (
				<View
					style={{
						flex: 1,
						padding: 18,
						borderRadius: 10,

						justifyContent: 'center',
						alignItems: 'center',
						rowGap: 8
					}}
				>
					<Swing size={28} color={Colors.primary} />
					<Text
						style={{
							fontFamily: 'Outfit',
							fontWeight: 500
						}}
					>
						Loading...
					</Text>
				</View>
			) : (
				<View style={{ flex: 1 }}>
					<BatchHeader title={currentRoute} />
					{currentCategory === 'ingredients_glossary' ? (
						<SectionList
							onEndReachedThreshold={0.2}
							onEndReached={handleEndReached}
							ListHeaderComponent={() => {
								if (currentCategory === 'ingredients_glossary') {
									return (
										<View>
											<SearchBar
												closeQueryResults={closeQueryResults}
												handleQuery={handleQuery}
												style={{
													backgroundColor: Colors.backgroundColor
												}}
											/>

											<Animated.View
												style={[
													{
														borderRadius: 14,
														padding: 16,
														top: 45,
														backgroundColor: Colors.backgroundColor,

														position: 'absolute',
														width: '100%',
														rowGap: 20
													},
													animatedQueryResult
												]}
											>
												{queryResult?.length <= 0 && (
													<Text
														style={{
															textAlign: 'center',
															fontSize: 10,
															fontFamily: 'Outfit'
														}}
													>
														No results found. Please try a different search term.
													</Text>
												)}

												{queryResult?.map((item, index) => (
													<TouchableOpacity
														onPress={() => {
															router.push({
																pathname: `/learn/${currentCategory}/details`,
																params: {
																	selectedItem: item?.id
																}
															});

															closeQueryResults();
														}}
														key={item?.id}
														style={{ flexDirection: 'row', alignItems: 'center' }}
													>
														<Text
															style={{
																fontFamily: 'Outfit',
																color: index === 0 ? Colors.primary : Colors.textColor,
																fontWeight: 700,
																width: 200
															}}
														>
															{item?.ingredient_name}
														</Text>

														{index === 0 && (
															<Text
																style={{
																	fontFamily: 'Outfit',
																	paddingLeft: '14%',
																	fontStyle: 'italic',
																	color: Colors.textColor + '7a',
																	fontWeight: 800,
																	width: 180,
																	fontSize: 12
																}}
															>
																Suggested
															</Text>
														)}
													</TouchableOpacity>
												))}
											</Animated.View>
										</View>
									);
								}
							}}
							ListHeaderComponentStyle={{
								marginBottom: currentCategory === 'ingredients_glossary' && 20,
								zIndex: 1
							}}
							ListFooterComponent={renderFooterComponent}
							ListFooterComponentStyle={{
								paddingBottom: bottom + 20
							}}
							getEstimatedItemSize={estimatedItemSize}
							waitForInitialLayout={true}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								gap: 20,
								paddingHorizontal: PagePadding.config.paddingHorizontal,

								paddingTop: PagePadding.config.paddingTop
							}}
							keyExtractor={(item) => item.id}
							sections={sectionListData}
							renderItem={renderItem}
						/>
					) : (
						<LegendList
							ref={scrollViewRef}
							onScroll={({ nativeEvent }) => {
								if (nativeEvent.contentOffset.y < 0) {
									scrollViewRef.current?.scrollToOffset({ x: 0, y: 0 });
								}
							}}
							onEndReachedThreshold={0.5}
							onEndReached={handleEndReached}
							ListFooterComponent={renderFooterComponent}
							ListFooterComponentStyle={{
								paddingBottom: bottom + 20
							}}
							recycleItems={true}
							getEstimatedItemSize={estimatedItemSize}
							waitForInitialLayout={true}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								gap: 20,
								paddingHorizontal: PagePadding.config.paddingHorizontal,

								paddingTop: PagePadding.config.paddingTop
							}}
							keyExtractor={(item) => item.id}
							data={dataList}
							renderItem={renderItem}
						/>
					)}
				</View>
			)}
		</>
	);
}
