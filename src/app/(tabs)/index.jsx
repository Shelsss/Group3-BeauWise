import Card from '@/components/home/Card';
import HistoryCard from '@/components/history/Card';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
	Focus,
	Camera,
	Shield,
	TriangleAlert,
	ChevronRight,
	LockKeyhole
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

import PagePadding from '@/constants/PagePadding';
import { router, useRouter } from 'expo-router';
import Write from '@/components/icons/Write';
import Archive from '@/components/icons/ArchiveFill';
import ShieldCheck from '@/components/icons/ShieldCheckFill';
import CustomHeader from '@/components/CustomHeader';
import { useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import {
	count,
	doc,
	getDoc,
	getFirestore,
	query
} from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';

const ICON_SIZE = 25;

const homeSchema = [
	{
		sectionTitle: 'Dashboard',
		cards: [
			{
				headerContent: (count = 0) => count,
				footerContent: 'total scans',
				themeColor: Colors.primary,
				icon: () => <Camera color={Colors.primary} size={15} />
			},
			{
				headerContent: '70%',
				footerContent: 'Average safety score',
				themeColor: '#00ACC1',
				icon: () => <Shield fill={'#00ACC1'} size={15} stroke={0} />,
				iconPosition: 'right'
			},

			{
				headerContent: (count = 0) => count,
				footerContent: 'Legally verfied products',
				themeColor: '#20C997',
				icon: () => <ShieldCheck color={'#20C997'} size={15} />,
				iconPosition: 'left'
			},
			{
				headerContent: 'Alcohol',
				subHeaderContent: 'Found in 5 products',
				footerContent: 'top irritant',
				specialFontSize: true,
				isUniquePosition: true,
				themeColor: '#ff7a7c',
				icon: () => <TriangleAlert color={'#ff7a7c'} size={15} />
			}
		]
	},

	{
		sectionTitle: 'Scan Options',
		cards: [
			{
				headerContent: 'Camera Scan',
				footerContent: 'Quick OCR Capture',
				themeColor: Colors.primary,
				icon: () => <Focus color={'#fff'} size={24} />,
				navigationTarget: 'scanner/scan'
			},
			{
				headerContent: 'Manual Input',
				footerContent: 'Type ingredients',
				themeColor: Colors.backgroundColor,
				icon: () => <Write color={Colors.primary} size={24} />,
				hasBorder: true,
				navigationTarget: 'scanner/details'
			}
		]
	},

	{
		sectionTitle: 'Smart Tools',
		cards: [
			{
				headerContent: 'Batch Lookup',
				footerContent: 'Check product freshness',
				themeColor: '#00ACC1',
				icon: () => <Archive size={ICON_SIZE} color={'#00ACC1'} />,
				navigationTarget: '/batch'
			},
			{
				headerContent: 'FDA Product Verifier',
				footerContent: 'Confirm regulatory compliance',
				themeColor: '#20C997',
				icon: () => <ShieldCheck size={ICON_SIZE} color={'#20C997'} />,
				navigationTarget: '/fda'
			}
		]
	}
];

const db = getFirestore();

const fetchData = async () => {
	const queryOption = query(doc(db, 'users', auth.currentUser.uid, 'scanCount'));

	const documentSnapshot = await getDoc(queryOption);

	return documentSnapshot.data();
};

export default function HomeScreen() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const route = useRouter();
	const scrollViewRef = useRef(null);

	const handleNavigate = (routeName) => () => {
		route.push(routeName);
	};

	const { data, refetch } = useQuery({
		queryKey: [auth.currentUser?.uid],
		queryFn: fetchData,
		enabled: !!isAuthenticated,
		onError: (error) => {
			console.log('Error fetching profile data:', error);
		}
	});

	return (
		<>
			<CustomHeader title={'Beauwise'} />
			<ScrollView
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				contentContainerStyle={[
					{
						rowGap: 35
					},
					PagePadding.config
				]}
			>
				<View style={{ rowGap: 15 }}>
					{isAuthenticated && (
						<View style={{ rowGap: 12 }}>
							<View>
								<Text
									style={{
										fontSize: 18,
										fontWeight: 'bold'
									}}
								>
									{homeSchema[0].sectionTitle}
								</Text>
							</View>

							<View style={{ flex: 1, rowGap: 12 }}>
								<View
									style={{
										flex: 1,
										flexDirection: 'row',
										columnGap: 12
									}}
								>
									{homeSchema[0].cards.slice(0, 2).map((card, index) => (
										<Card
											containerStyle={[
												{
													backgroundColor: Colors.backgroundColor
												}
											]}
											key={index}
										>
											<View>
												<Text
													style={{
														fontSize: 48,
														fontWeight: 700,
														color: card.themeColor,
														textAlign: 'center'
													}}
												>
													{typeof card.headerContent === 'function'
														? card.headerContent(data?.scanHistory?.length)
														: card.headerContent}
												</Text>

												<Text
													style={{
														fontSize: 10,
														fontWeight: 600,
														textTransform: 'capitalize',
														color: Colors.textColor,
														textAlign: 'center'
													}}
												>
													{card.footerContent}
												</Text>
											</View>
											<View
												style={[
													STYLES.iconStyle,
													card.iconPosition === 'right'
														? STYLES.iconRight
														: STYLES.iconLeft,
													{
														position: 'absolute'
													}
												]}
											>
												{card.icon()}
											</View>
										</Card>
									))}
								</View>

								<View
									style={{
										flexDirection: 'row',
										columnGap: 12
									}}
								>
									{homeSchema[0].cards.slice(2).map((card, index) => (
										<Card
											containerStyle={[
												{
													backgroundColor: Colors.backgroundColor,
													justifyContent: 'center',
													alignItems: 'center',
													...STYLES.shadowStyle
												}
											]}
											key={index}
										>
											<View>
												<Text
													style={{
														fontSize: card?.specialFontSize ? 24 : 48,
														fontWeight: 700,
														textAlign: 'center',
														color: card.themeColor,
														paddingTop: card?.isUniquePosition ? 9 : 0,
														paddingBottom: card?.isUniquePosition ? 9 : 0
													}}
												>
													{typeof card.headerContent === 'function'
														? card.headerContent()
														: card.headerContent}
												</Text>

												<Text
													style={{
														fontSize: 10,
														fontWeight: 600,
														textTransform: 'capitalize',
														textAlign: 'center',
														color: Colors.textColor
													}}
												>
													{card.footerContent}
												</Text>
											</View>

											{card.subHeaderContent && (
												<Text
													style={{
														fontSize: 10,
														backgroundColor: card.themeColor + '1a',
														paddingHorizontal: 6,
														borderRadius: 10,
														color: card.themeColor + 'cc',
														position: card?.isUniquePosition ? 'absolute' : 'relative',
														top: card?.isUniquePosition ? 10 : 0,
														left: card?.isUniquePosition ? 10 : 0
													}}
												>
													{card.subHeaderContent}
												</Text>
											)}

											<View
												style={[
													STYLES.iconStyle,
													card.iconPosition === 'left'
														? STYLES.iconLeft
														: STYLES.iconRight,
													{
														position: 'absolute'
													}
												]}
											>
												{card.icon()}
											</View>
										</Card>
									))}
								</View>
							</View>
						</View>
					)}

					<View
						style={{
							flexDirection: 'row',
							columnGap: 12,
							marginTop: 32,
							marginBottom: 32
						}}
					>
						{homeSchema[1].cards.map((card, index) => (
							<Card
								key={index}
								handleNavigate={handleNavigate('/scanner')}
								containerStyle={{
									alignItems: 'center',
									backgroundColor: card.themeColor,
									borderColor: card.hasBorder ? Colors.primary : 'transparent',
									borderWidth: card.hasBorder ? 2 : 0,

									borderRadius: 16
								}}
							>
								<View
									style={{
										backgroundColor:
											card.themeColor === Colors.backgroundColor
												? Colors.primary + '1a'
												: '#ffffff1a',
										borderColor: '#ffffff9a',
										borderWidth: 1,
										borderRadius: 50,
										padding: 20
									}}
								>
									{card.icon()}
								</View>

								<View style={{ marginTop: 12 }}>
									<Text
										style={{
											fontSize: 16,
											fontWeight: '600',
											color:
												card.themeColor === Colors.backgroundColor
													? Colors.primary
													: '#fff',
											marginBottom: 4,
											textAlign: 'center'
										}}
									>
										{card.headerContent}
									</Text>

									<Text
										style={{
											fontSize: 12,
											color:
												card.themeColor === Colors.backgroundColor
													? Colors.primary
													: '#fff',
											textAlign: 'center'
										}}
									>
										{card.footerContent}
									</Text>
								</View>
							</Card>
						))}
					</View>
				</View>

				<View style={{ rowGap: 12 }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold'
						}}
					>
						{homeSchema[2].sectionTitle}
					</Text>
					<View style={{ rowGap: 16 }}>
						{homeSchema[2].cards.map((card, index) => (
							<Card
								handleNavigate={handleNavigate(card.navigationTarget)}
								key={index}
								containerStyle={{
									backgroundColor: '#fff',
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<View
									style={{
										backgroundColor: card.themeColor + '1a',
										borderRadius: 10,
										padding: 16
									}}
								>
									{card.icon()}
								</View>

								<View style={{ marginLeft: 16 }}>
									<Text
										style={{
											fontSize: 16,
											fontWeight: '600',
											color: Colors.textColor,
											marginBottom: 4
										}}
									>
										{card.headerContent}
									</Text>
									<Text
										style={{
											fontSize: 12,
											color: Colors.textColor
										}}
									>
										{card.footerContent}
									</Text>
								</View>

								<View
									style={{
										marginLeft: 'auto'
									}}
								>
									<ChevronRight />
								</View>
							</Card>
						))}
					</View>
				</View>

				{isAuthenticated && (
					<View style={{ rowGap: 12 }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold'
							}}
						>
							Recent Scans
						</Text>

						<HistoryCard
							title={'Matte Stick'}
							description={'bar'}
							time={'9:05 PM'}
							status={'safe'}
						/>

						<HistoryCard
							title={'Matte Stick'}
							description={'bar'}
							time={'9:05 PM'}
							status={'warn'}
						/>
						<HistoryCard
							title={'Matte Stick'}
							description={'bar'}
							time={'9:05 PM'}
							status={'unsafe'}
						/>
					</View>
				)}

				{!isAuthenticated && (
					<View
						style={[
							{
								alignItems: 'center',
								backgroundColor: Colors.backgroundColor,
								borderRadius: 16,
								padding: 24
							},
							STYLES.shadow
						]}
					>
						<View
							style={{
								backgroundColor: Colors.primary + '1a',
								padding: 16,
								borderRadius: 100
							}}
						>
							<LockKeyhole color={Colors.primary} size={20} />
						</View>

						<View style={{ marginTop: 10, rowGap: 8 }}>
							<Text style={{ fontSize: 18, fontWeight: 600, textAlign: 'center' }}>
								Personalize Your Experience
							</Text>
							<Text style={{ color: Colors.textColor + '9a', textAlign: 'center' }}>
								Sign up to match ingredients against your unique skin and hair profile,
								save your daily scan history, and easily track your products.
							</Text>

							<TouchableOpacity
								onPress={() => router.push('authentication/sign-in')}
								activeOpacity={0.7}
								style={{
									marginTop: 6,
									justifyContent: 'center',
									columnGap: 12,
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: Colors.primary,
									padding: 16,
									borderRadius: 16
								}}
							>
								<Text
									style={{
										fontWeight: 600,
										color: Colors.backgroundColor
									}}
								>
									Create Account
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</>
	);
}

const STYLES = StyleSheet.create({
	shadow: {
		shadowColor: '#000000a9',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	},
	iconStyle: {
		borderRadius: 13,
		padding: 10,
		position: 'absolute',
		top: 2
	},

	iconLeft: {
		left: 2
	},

	iconRight: {
		right: 2
	}
});
