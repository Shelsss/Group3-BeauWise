import PagePadding from '@/constants/PagePadding';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import {
	getFirestore,
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
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import Card from '@/components/learn/ingredients-glossary/Card';
import CardMyths from '@/components/learn/myths/Card';
import CardAwareness from '@/components/learn/awareness/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonCard from '@/components/learn/ingredients-glossary/SkeletonCard';
import LottieView from 'lottie-react-native';

const db = getFirestore();

export default function Index() {
	const scrollViewRef = useRef(null);
	const { category } = useLocalSearchParams();
	const [isTransitionFinished, setIsTransitionFinished] = useState(false);
	const { bottom } = useSafeAreaInsets();

	const currentCategory = category.match(/\[(.*?)\]/)[1];

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

	useFocusEffect(
		useCallback(() => {
			const handle = requestIdleCallback(() => {
				setIsTransitionFinished(true);
			});

			return () => {
				if (handle) cancelIdleCallback(handle);
				setIsTransitionFinished(false);
			};
		}, [])
	);

	const { data, isPending, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: [currentCategory],
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

	const dataList = data?.pages.flatMap((page) => page.data) ?? [];

	if (!isTransitionFinished || isPending) {
		return (
			<LottieView
				style={{
					marginTop: '60%',
					alignSelf: 'center',
					aspectRatio: 1,
					width: 200
				}}
				speed={2.5}
				autoPlay
				loop={true}
				source={require('assets/lottie/loader.json')}
			/>
		);
	}

	return (
		<View style={{ flex: 1 }}>
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
				style={{ gap: 20 }}
				contentContainerStyle={{
					gap: 20,
					paddingHorizontal: PagePadding.config.paddingHorizontal,

					paddingTop: PagePadding.config.paddingTop
				}}
				keyExtractor={(item) => item.id}
				data={dataList}
				renderItem={renderItem}
			/>
		</View>
	);
}
