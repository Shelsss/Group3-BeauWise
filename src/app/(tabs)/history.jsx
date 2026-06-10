import AnimatedTabs from '@/components/AnimatedTabs';
import CreateAccountButton from '@/components/CreateAccountButton';
import CustomHeader from '@/components/CustomHeader';
import Card from '@/components/history/Card';
import Disclaimer from '@/components/history/Disclaimer';
import GuestModeView from '@/components/history/GuessModeView';
import HistoryBottomSheet from '@/components/history/HistoryBottomSheet';
import SearchBar from '@/components/SearchBar';
import SearchFilter from '@/components/SearchFilter';
import SingleSidedShadow from '@/components/SingleSidedShadow';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { useAuthStore } from '@/stores/useAuthStore';
import { router } from 'expo-router';

import { useRef, useState } from 'react';
import {
	Text,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	SectionList,
	Vibration
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Shadow } from 'react-native-shadow-2';

const mockData = [
	{
		title: 'today',
		data: [
			{ title: 'Hydrating Hyaluronic Acid Serum', time: '08:15 AM', status: 'safe' },
			{
				title: 'Midnight Repair Night Cream (Batch B)',
				time: '09:45 AM',
				status: 'warn'
			},
			{ title: 'Organic Tea Tree Essential Oil', time: '10:30 AM', status: 'safe' },
			{ title: 'Ultra-Matte Longwear Foundation', time: '11:20 AM', status: 'unsafe' },
			{ title: 'Mineral SPF 50 Sunscreen', time: '01:05 PM', status: 'safe' },
			{ title: 'Rosewater Revitalizing Toner', time: '02:50 PM', status: 'warn' },
			{ title: 'Exfoliating Glycolic Acid Peel', time: '04:15 PM', status: 'unsafe' }
		]
	},
	{
		title: 'yesterday',
		data: [
			{ title: 'Hydrating Hyaluronic Acid Serum', time: '08:15 AM', status: 'safe' },
			{
				title: 'Midnight Repair Night Cream (Batch B)',
				time: '09:45 AM',
				status: 'warn'
			},
			{ title: 'Organic Tea Tree Essential Oil', time: '10:30 AM', status: 'safe' },
			{ title: 'Ultra-Matte Longwear Foundation', time: '11:20 AM', status: 'unsafe' },
			{ title: 'Mineral SPF 50 Sunscreen', time: '01:05 PM', status: 'safe' },
			{ title: 'Rosewater Revitalizing Toner', time: '02:50 PM', status: 'warn' },
			{ title: 'Exfoliating Glycolic Acid Peel', time: '04:15 PM', status: 'unsafe' }
		]
	}
];

export default function HistoryScreen() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const pageRef = useRef(null);
	const historySheetModalRef = useRef(null);

	const [tab, setTab] = useState(0);
	const [query, setQuery] = useState('');

	const handleQuery = (value) => () => setQuery(value);

	const handleTabChange = (value) => {
		requestAnimationFrame(() => {
			setTab(value);
			pageRef.current?.setPage(value);
		});
	};

	const handlePresentModalPress = () => {
		historySheetModalRef.current?.present();
		Vibration.vibrate(50);
	};

	const handleScanHistory = () => {
		// router.push('scanner/results');
		// Vibration.vibrate(50);
	};
	return (
		<View style={{ flex: 1 }}>
			<TouchableWithoutFeedback
				touchSoundDisabled={true}
				onPress={Keyboard.dismiss}
				accessible={false}
			>
				<View style={{ zIndex: 2 }}>
					<CustomHeader title={'History'} />

					{isAuthenticated && (
						<SingleSidedShadow hasDefaultStyle={true}>
							<View
								style={{
									backgroundColor: Colors.backgroundColor,
									paddingHorizontal: PagePadding.config.paddingHorizontal,
									paddingBottom: 8,
									borderBottomStartRadius: 16,
									borderBottomEndRadius: 16,

									paddingTop: 16,
									rowGap: 16,

									shadowColor: '#000',
									shadowOffset: { width: 1, height: 1 },
									shadowOpacity: 0.4,
									shadowRadius: 3,
									elevation: 8
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										columnGap: 10
									}}
								>
									<SearchBar style={{ flex: 1 }} handleQuery={handleQuery} />
									<SearchFilter handlePress={handlePresentModalPress} />
								</View>

								<AnimatedTabs
									style={{ marginTop: 10 }}
									tabs={['Scans', 'Batch Code', 'FDA']}
									handleTabChange={handleTabChange}
									currentIndex={tab}
								/>
							</View>
						</SingleSidedShadow>
					)}
				</View>
			</TouchableWithoutFeedback>

			{!isAuthenticated && <GuestModeView />}

			{isAuthenticated && (
				<PagerView
					offscreenPageLimit={1}
					onPageSelected={({ nativeEvent: { position } }) => handleTabChange(position)}
					ref={pageRef}
					overScrollMode='never'
					style={{ flex: 1, padding: 50 }}
					pageMargin={100}
					initialPage={tab}
				>
					<View key={1} style={{ width: '100%', height: '100%', zIndex: 1 }}>
						<SectionList
							contentContainerStyle={{
								rowGap: 15,
								paddingHorizontal: PagePadding.config.paddingHorizontal,
								paddingBottom: 40,
								paddingTop: 15
							}}
							sections={mockData}
							keyExtractor={(item, index) => `${item.title}-${index}`}
							renderItem={({ item }) => (
								<Card
									onPress={handleScanHistory}
									time={item.time}
									status={item.status}
									title={item.title}
								/>
							)}
							stickySectionHeadersEnabled={true}
							showsVerticalScrollIndicator={false}
							renderSectionHeader={({ section }) => (
								<SectionHeader title={section.title} />
							)}
						/>
					</View>

					<View key={2} style={{ width: '100%', height: '100%' }}>
						<SectionList
							contentContainerStyle={{
								rowGap: 15,
								paddingHorizontal: PagePadding.config.paddingHorizontal,
								paddingBottom: 40,
								paddingTop: 15
							}}
							sections={mockData}
							keyExtractor={(item, index) => `${item.title} + ${index}`}
							renderItem={({ item }) => (
								<Card
									type='batch'
									time={item.time}
									status={item.status}
									title={item.title}
								/>
							)}
							stickySectionHeadersEnabled={true}
							showsVerticalScrollIndicator={false}
							renderSectionHeader={({ section }) => (
								<SectionHeader title={section.title} />
							)}
							ListFooterComponent={
								<Disclaimer
									description={`Expiry dates are estimates for unopened products. Once opened, please follow the PAO (Period After Opening) symbol on the packaging, usually marked as 6M, 12M, etc. "Invalid" results may occur if a brand recently updated its batch code format. Always discard products that change in color, smell, or texture.`}
								/>
							}
						/>
					</View>

					<View key={3} style={{ width: '100%', height: '100%' }}>
						<SectionList
							contentContainerStyle={{
								rowGap: 15,
								paddingHorizontal: PagePadding.config.paddingHorizontal,
								paddingBottom: PagePadding.config.paddingBottom - 15,
								paddingTop: 15
							}}
							sections={mockData}
							keyExtractor={(item, index) => `${item.title} + ${index}`}
							renderItem={({ item }) => (
								<Card
									type='fda'
									time={item.time}
									status={item.status}
									title={item.title}
								/>
							)}
							stickySectionHeadersEnabled={true}
							showsVerticalScrollIndicator={false}
							renderSectionHeader={({ section }) => (
								<SectionHeader title={section.title} />
							)}
							ListFooterComponent={
								<Disclaimer
									description={`The verification statuses displayed in this history log are cached records from your previous searches. FDA product notifications are subject to expiration and revocation. BeauWise recommends running a new verification check for the most up-to-date compliance status.`}
								/>
							}
						/>
					</View>
				</PagerView>
			)}

			<HistoryBottomSheet historySheetModalRef={historySheetModalRef} />
		</View>
	);
}

function SectionHeader({ title }) {
	return (
		<View style={{ marginBottom: 10, marginTop: 10, backgroundColor: 'transparent' }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 12,
						letterSpacing: 1,
						fontWeight: '700',
						color: '#9a9a9a',
						textTransform: 'uppercase'
					}}
				>
					{title}
				</Text>
				<View style={{ backgroundColor: '#9a9a9a', height: 1, flex: 1 }} />
			</View>
		</View>
	);
}
