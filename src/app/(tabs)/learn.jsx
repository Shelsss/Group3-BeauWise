import CustomHeader from '@/components/CustomHeader';

import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { ScrollView, Text, View } from 'react-native';

import { useRef } from 'react';
import Card from '@/components/learn/index/Card';
import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

const db = getFirestore();
const collectionRef = collection(db, 'learn_metadata');

const fetchLearnData = async () => {
	const learnMetadata = await getDocs(collectionRef);
	return learnMetadata.docs.map((doc) => ({ ...doc.data() }));
};

export default function LearnScreen() {
	const scrollViewRef = useRef(null);

	const { data, isLoading, error } = useQuery({
		queryKey: ['learn_metadata'],
		queryFn: fetchLearnData
	});

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<CustomHeader title={'Learn'} />
			</View>

			<ScrollView
				ref={scrollViewRef}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingBottom: PagePadding.config.paddingBottom,
					paddingTop: PagePadding.config.paddingTop
				}}
			>
				<View style={{ marginBottom: 20 }}>
					<Text
						style={{
							fontSize: 24,
							fontWeight: 700,
							color: Colors.textColor
						}}
					>
						The BeauWise Library
					</Text>
					<Text
						style={{
							lineHeight: 22,
							letterSpacing: 0.9,
							color: Colors.textColor + '7a'
						}}
					>
						Understand your cosmetic ingredients backed by dermatological data.
					</Text>
				</View>

				<View
					style={{
						rowGap: 26
					}}
				>
					{data?.map((item) => (
						<Card
							key={item.tag}
							title={item.label}
							description={item.description}
							tag={item.tag}
							routeTarget={item.route_target}
							buttonLabel={item.button_label}
						/>
					))}
				</View>

				<View
					style={{
						backgroundColor: '#e8f5e9',
						padding: 16,
						borderRadius: 16,
						marginTop: 18
					}}
				>
					<Text style={{ fontWeight: 600, color: Colors.textColor }}>
						Cosmetic Literacy Notice
					</Text>
					<Text
						style={{
							fontSize: 12,
							color: Colors.textColor + '9a'
						}}
					>
						The information in this module is sourced from established cosmetic literature
						and guidelines. It is strictly for educational purposes and does not replace
						professional medical advice. For clinical skin concerns or severe reactions,
						always consult a board-certified dermatologist.
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}
