import PagePadding from '@/constants/PagePadding';
import MythLayout from '@/components/learn/myths/PageLayout';
import IngredientsLayout from '@/components/learn/ingredients-glossary/PageLayout';
import AwarenessLayout from '@/components/learn/awareness/PageLayout';
import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDoc } from '@react-native-firebase/firestore';
import SourceLink from '@/components/SourceLink';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swing } from 'react-native-animated-spinkit';
import Colors from '@/constants/Colors';
import { db } from '@/services/firestore';

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

	return isPending ? (
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
				{category === 'ingredients_glossary' && <IngredientsLayout item={data} />}
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
