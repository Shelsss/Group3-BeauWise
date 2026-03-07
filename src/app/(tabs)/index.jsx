import Card from '@/components/home/Card';
import HistoryCard from '@/components/history/Card';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Focus, Camera, Shield, TriangleAlert, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

import PagePadding from '@/constants/PagePadding';
import { useRouter } from 'expo-router';
import Write from '@/components/icons/Write';
import Archive from '@/components/icons/ArchiveFill';
import ShieldCheck from '@/components/icons/ShieldCheckFill';

const ICON_SIZE = 25;

const homeSchema = [
	{
		sectionTitle: 'Dashboard',
		cards: [
			{
				headerContent: 24,
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
				headerContent: 12,
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
				navigationTarget: '/scanner'
			},
			{
				headerContent: 'Manual Input',
				footerContent: 'Type ingredients',
				themeColor: Colors.backgroundColor,
				icon: () => <Write color={Colors.primary} size={24} />,
				hasBorder: true,
				navigationTarget: '/scanner'
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

export default function HomeScreen() {
	const route = useRouter();

	const handleNavigate = (routeName) => () => {
		route.push(routeName);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={[
				{
					rowGap: 35
				},
				PagePadding.config
			]}
		>
			<View style={{ rowGap: 15 }}>
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
											{card.headerContent}
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
											card.iconPosition === 'right' ? STYLES.iconRight : STYLES.iconLeft,
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
											{card.headerContent}
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
											card.iconPosition === 'left' ? STYLES.iconLeft : STYLES.iconRight,
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

				<View
					style={{ flexDirection: 'row', columnGap: 12, marginTop: 32, marginBottom: 32 }}
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
		</ScrollView>
	);
}

const STYLES = StyleSheet.create({
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
