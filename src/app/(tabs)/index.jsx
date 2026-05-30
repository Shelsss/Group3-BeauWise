import Card from '@/components/home/Card';
import HistoryCard from '@/components/history/Card';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Focus, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

import PagePadding from '@/constants/PagePadding';
import { router, useRouter } from 'expo-router';
import Write from '@/components/icons/Write';
import CustomHeader from '@/components/CustomHeader';
import { useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, getFirestore, query } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import Flask from '@/components/icons/Flask';
import ShieldCheck2 from '@/components/icons/hugeicons/ShieldCheck';
import InputNumeric from '@/components/icons/hugeicons/InputNumeric';
import Camera from '@/components/icons/hugeicons/Camera';
import Shield from '@/components/icons/hugeicons/Shield';
import TestTube from '@/components/icons/hugeicons/TestTube';
import Lock2 from '@/components/icons/hugeicons/Lock2';
import Retry from '@/components/Retry';
import { Swing } from 'react-native-animated-spinkit';

const ROW_SPACING = 30;

const homeSchema = [
	{
		sectionTitle: 'Dashboard',
		cards: [
			{
				headerContent: (count = 0) => count,
				footerContent: 'total scans',
				themeColor: '#FF8585',
				icon: () => <Camera color={'#FF8585'} size={18} />
			},
			{
				headerContent: '77',
				footerContent: 'Aligned Ingredients',
				themeColor: '#20C997',
				icon: () => <Shield color={'#20C997'} size={18} />,
				iconPosition: 'right'
			},

			{
				headerContent: (count = 0) => count,
				footerContent: 'FDA-Notified Products',
				themeColor: '#00ACC1',
				icon: () => <ShieldCheck2 color={'#00ACC1'} size={18} />,
				iconPosition: 'left'
			},
			{
				headerContent: 'Niacinamide',
				subHeaderContent: 'Found in 5 products',
				footerContent: 'most scanned ingredient',
				specialFontSize: true,
				isUniquePosition: true,
				themeColor: Colors.primary,
				icon: () => <TestTube color={Colors.primary} size={18} />
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
				headerContent: 'Batch Code Lookup',
				footerContent: 'Check product freshness',
				icon: () => <InputNumeric color={'#334155'} />,
				navigationTarget: '/batch'
			},
			{
				headerContent: 'FDA Product Verifier',
				footerContent: 'Confirm regulatory compliance',
				icon: () => <ShieldCheck2 color={'#334155'} />,
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

	const { data, refetch, isError, isRefetchError, isLoading, isRefetching } = useQuery({
		queryKey: [auth.currentUser?.uid + '-dashboard'],
		queryFn: fetchData,
		enabled: !!isAuthenticated,
		onError: (error) => {
			console.log('Error fetching profile data:', error);
		}
	});

	const retry = () =>
		refetch({
			throwOnError: true
		});

	return (
		<>
			<CustomHeader title={'BeauWise'} />

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
						Just a moment...
					</Text>
				</View>
			) : (
				<ScrollView
					ref={scrollViewRef}
					showsVerticalScrollIndicator={false}
					onScroll={({ nativeEvent }) => {
						if (nativeEvent.contentOffset.y < 0) {
							scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
						}
					}}
					contentContainerStyle={[
						PagePadding.config,
						{
							paddingBottom: 40
						}
					]}
				>
					<View style={{ rowGap: 15 }}>
						{isAuthenticated && !(isError || isRefetchError) && (
							<View>
								<View style={{ flex: 1, rowGap: 8 }}>
									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											columnGap: 8
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
															fontFamily: 'Outfit',
															fontSize: 24,
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
															fontFamily: 'Outfit',
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
											columnGap: 8
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
															fontFamily: 'Outfit',
															fontSize: card?.specialFontSize ? 16 : 24,
															fontWeight: 700,
															textAlign: 'center',
															color: card.themeColor,
															paddingTop: card?.isUniquePosition ? 14 : 0
														}}
													>
														{typeof card.headerContent === 'function'
															? card.headerContent()
															: card.headerContent}
													</Text>

													<Text
														style={{
															fontFamily: 'Outfit',
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
															fontFamily: 'Outfit',
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
					</View>

					<View
						style={{
							rowGap: 4,
							marginTop: isAuthenticated && !(isError || isRefetchError) ? ROW_SPACING : 0
						}}
					>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontSize: 16,
								fontWeight: 700
							}}
						>
							{homeSchema[2].sectionTitle}
						</Text>
						<View style={{ rowGap: 8 }}>
							{homeSchema[2].cards.map((card, index) => (
								<Card
									handleNavigate={handleNavigate(card.navigationTarget)}
									key={index}
									containerStyle={{
										backgroundColor: '#fff',
										flexDirection: 'row',
										alignItems: 'center',
										padding: 12
									}}
								>
									<View style={{ marginLeft: 6 }}>{card.icon()}</View>

									<View style={{ marginLeft: 16 }}>
										<Text
											style={{
												fontFamily: 'Outfit',
												fontSize: 14,
												fontWeight: '600',
												color: Colors.textColor
											}}
										>
											{card.headerContent}
										</Text>
										<Text
											style={{
												fontFamily: 'Outfit',
												fontSize: 10,
												color: Colors.textColor
											}}
										>
											{card.footerContent}
										</Text>
									</View>

									<View
										style={{
											marginLeft: 'auto',
											marginRight: 8
										}}
									>
										<ChevronRight size={16} color={'#334155ad'} />
									</View>
								</Card>
							))}
						</View>
					</View>

					{isAuthenticated && !(isError || isRefetchError) && (
						<View style={{ marginTop: ROW_SPACING, rowGap: 6 }}>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontSize: 16,
									fontWeight: 700
								}}
							>
								Recent Scans
							</Text>

							<View style={{ rowGap: 8 }}>
								<HistoryCard title={'Matte Stick'} description={'bar'} time={'9:05 PM'} />
								<HistoryCard title={'Matte Stick'} description={'bar'} time={'9:05 PM'} />
								<HistoryCard title={'Matte Stick'} description={'bar'} time={'9:05 PM'} />
							</View>
						</View>
					)}

					{(isError || isRefetchError) && (
						<View style={{ flex: 1, marginTop: '20%' }}>
							<Retry title={`We're missing a few pieces here.`} refetch={retry} />
						</View>
					)}

					{!isAuthenticated && (
						<View
							style={[
								{
									marginTop: ROW_SPACING,
									alignItems: 'center',
									backgroundColor: Colors.backgroundColor,
									borderRadius: 20,
									padding: 26
								},
								STYLES.shadow
							]}
						>
							<View style={{ rowGap: 8 }}>
								<View style={{ alignItems: 'center', marginBottom: 8 }}>
									<Lock2 color={Colors.textColor} size={40} />
								</View>

								<Text
									style={{
										fontFamily: 'Outfit',
										fontSize: 14,
										fontWeight: 600,
										textAlign: 'center'
									}}
								>
									Personalize Your Experience
								</Text>
								<Text
									style={{
										fontSize: 12,
										fontFamily: 'Outfit',
										color: Colors.textColor + '9a',
										textAlign: 'center'
									}}
								>
									Sign up to match ingredients against your unique skin and hair profile,
									save your daily scan history, and easily track your products.
								</Text>

								<TouchableOpacity
									onPress={() => router.push('authentication/sign-in')}
									activeOpacity={0.7}
									style={{
										marginTop: 14,
										justifyContent: 'center',
										columnGap: 12,
										flexDirection: 'row',
										alignItems: 'center',
										backgroundColor: Colors.primary,
										padding: 14,
										borderRadius: 10
									}}
								>
									<Text
										style={{
											fontSize: 12,
											fontFamily: 'Outfit',
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
			)}
		</>
	);
}

const STYLES = StyleSheet.create({
	shadow: {
		shadowColor: '#00000023',
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
