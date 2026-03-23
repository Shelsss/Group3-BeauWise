import PagePadding from '@/constants/PagePadding';
import MythLayout from '@/components/learn/myths/PageLayout';
import PageLayout from '@/components/learn/ingredients-glossary/PageLayout';
import AwarenessLayout from '@/components/learn/awareness/PageLayout';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import {
	getFirestore,
	collection,
	query,
	where,
	getDoc
} from '@react-native-firebase/firestore';
import SourceLink from '@/components/SourceLink';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const db = getFirestore();

export default function Details() {
	const scrollViewRef = useRef(null);

	const { bottom } = useSafeAreaInsets();
	const { category, selectedItem } = useLocalSearchParams();

	const collectionRef = collection(db, category);
	const fetchData = async () => {
		const q = query(collectionRef, where('id', '==', selectedItem));

		const querySnapshot = await getDoc(q);

		const ingredientsData = querySnapshot.docs.map((doc) => ({
			docId: doc.id,
			...doc.data()
		}));

		return { ...ingredientsData[0] };
	};

	const { data, isPending, error } = useQuery({
		queryKey: [selectedItem],
		queryFn: fetchData
	});

	if (isPending) {
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
		<ScrollView
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			showsVerticalScrollIndicator={false}
			ref={scrollViewRef}
			style={{ flex: 1 }}
		>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingBottom: bottom + 10,
					paddingTop: PagePadding.config.paddingTop + 10
				}}
			>
				{category === 'ingredients_glossary' && <PageLayout item={data} />}
				{category === 'consumer_awareness' && <AwarenessLayout item={data} />}
				{category === 'myths_facts' && <MythLayout item={data} />}

				<View style={{ rowGap: 8, marginTop: 20 }}>
					{data?.source_urls?.map((source) => (
						<SourceLink key={source} name={data.source_name} link={source} />
					))}

					{data?.source_url && (
						<SourceLink name={data.source_name} link={data?.source_url} />
					)}
				</View>
			</View>
		</ScrollView>
	);
}
