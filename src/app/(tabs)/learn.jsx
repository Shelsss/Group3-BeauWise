import CustomHeader from '@/components/CustomHeader';

import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { ScrollView, Text, View } from 'react-native';

import { useRef } from 'react';
import Card from '@/components/learn/index/Card';
import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { Swing } from 'react-native-animated-spinkit';
import Retry from '@/components/Retry';

const db = getFirestore();
const collectionRef = collection(db, 'learn_metadata');

const fetchLearnData = async () => {
	const learnMetadata = await getDocs(collectionRef);
	return learnMetadata.docs.map((doc) => ({ ...doc.data() }));
};

export default function LearnScreen() {
	const scrollViewRef = useRef(null);

	const { data, isLoading, isError, isRefetchError, refetch, isRefetching } = useQuery({
		queryKey: ['learn_metadata'],
		queryFn: fetchLearnData
	});

	const retry = () =>
		refetch({
			throwOnError: true
		});

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<CustomHeader title={'Learn'} />
			</View>

			{(isError || isRefetchError) && (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Retry refetch={retry} />
				</View>
			)}
			{isLoading || isRefetching ? (
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
					ref={scrollViewRef}
					onScroll={({ nativeEvent }) => {
						if (nativeEvent.contentOffset.y < 0) {
							scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
						}
					}}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: PagePadding.config.paddingHorizontal,
						paddingBottom: 40,
						paddingTop: PagePadding.config.paddingTop
					}}
				>
					<View style={{ marginBottom: 20 }}>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontSize: 18,
								fontWeight: 700,
								color: Colors.textColor
							}}
						>
							The BeauWise Library
						</Text>
						<Text
							style={{
								lineHeight: 20,
								fontFamily: 'Outfit',
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
						<Text
							style={{ fontWeight: 600, color: Colors.textColor, fontFamily: 'Outfit' }}
						>
							Cosmetic Literacy Notice
						</Text>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontSize: 12,
								color: Colors.textColor + '9a'
							}}
						>
							The information in this module is sourced from established cosmetic
							literature and guidelines. It is strictly for educational purposes and does
							not replace professional medical advice. For clinical skin concerns or
							severe reactions, always consult a board-certified dermatologist.
						</Text>
					</View>
				</ScrollView>
			)}
		</View>
	);
}
