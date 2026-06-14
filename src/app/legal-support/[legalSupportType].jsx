import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import TermsOfService from '@/constants/TermsOfService';
import { Circle } from 'lucide-react-native';
import PagePadding from '@/constants/PagePadding';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';
import LearnHeader from '@/components/learn/Header';
import PrivacyPolicy from '@/constants/PrivacyPolicy';
import MedicalDisclaimer from '@/constants/MedicalDisclaimer';
import ContactUs from '@/constants/ContactUs';
import AboutUs from '@/constants/AboutUs';
import { Image } from 'expo-image';
import BatchHeader from '@/components/batch/Header';

export default function LegalSupportType() {
	const { legalSupportType } = useLocalSearchParams();
	const { bottom } = useSafeAreaInsets();
	const scrollViewRef = useRef(null);
	const pageName = legalSupportType
		.split('-')
		.map((str) => str.at(0).toUpperCase() + str.split('').splice(1).join(''))
		.join(' ');

	const displayItem =
		legalSupportType === 'terms-of-service'
			? TermsOfService
			: legalSupportType === 'privacy-policy'
				? PrivacyPolicy
				: legalSupportType === 'medical-disclaimer'
					? MedicalDisclaimer
					: legalSupportType === 'contact-support'
						? ContactUs
						: AboutUs;

	return (
		<>
			<BatchHeader title={pageName} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				ref={scrollViewRef}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				contentContainerStyle={{
					paddingTop: PagePadding.config.paddingTop,
					paddingHorizontal: PagePadding.config.paddingHorizontal + 10,
					paddingBottom: bottom + 20,
					rowGap: 30
				}}
			>
				{legalSupportType === 'about-us' && (
					<Image
						style={{
							aspectRatio: 16 / 9,
							width: 200,
							alignSelf: 'center',
							marginTop: 20
						}}
						source={require('assets/images/logo.webp')}
					/>
				)}

				{displayItem.map((item, index) => (
					<View key={item.title}>
						<Text
							style={{
								fontWeight: 700,
								fontSize: 16,
								color: Colors.textColor,
								fontFamily: 'Outfit'
							}}
						>
							{legalSupportType !== 'about-us' &&
								legalSupportType !== 'contact-support' &&
								`${index + 1}. `}
							{item.title}
						</Text>

						{item.content && (
							<View style={{ rowGap: 20 }}>
								{item.content.map((content, index) => (
									<Text
										style={{
											color: Colors.textColor + '9a',
											lineHeight: 20,
											fontFamily: 'Outfit'
										}}
										key={index}
									>
										{content}
									</Text>
								))}
							</View>
						)}

						{item.list_items && (
							<View style={{ rowGap: 8, marginTop: 8 }}>
								{item?.list_items.map((content, index) => (
									<View
										key={index}
										style={{
											flexDirection: 'row',
											columnGap: 8,
											marginLeft: 8,
											paddingRight: 20
										}}
									>
										<Circle
											strokeWidth={0}
											fill={Colors.textColor}
											style={{ marginTop: 7 }}
											size={6}
										/>
										<Text
											style={{
												color: Colors.textColor + '9a',
												lineHeight: 20,
												fontFamily: 'Outfit'
											}}
										>
											{content}
										</Text>
									</View>
								))}
							</View>
						)}

						{item.additional_content && (
							<View style={{ rowGap: 20, marginTop: 20 }}>
								{item.additional_content.map((content, index) => (
									<Text
										style={{
											color: Colors.textColor + '9a',
											lineHeight: 20,
											fontFamily: 'Outfit'
										}}
										key={index}
									>
										{content}
									</Text>
								))}
							</View>
						)}

						{item.subsections && (
							<View style={{ rowGap: 20, marginTop: 20 }}>
								{item.subsections.map(
									({ title, content, list_items, additional_content }, index) => (
										<View style={{ rowGap: 4 }} key={index}>
											<Text
												style={{
													color: Colors.textColor,
													fontWeight: 700,
													fontFamily: 'Outfit'
												}}
											>
												{title}
											</Text>

											<Text
												style={{ color: Colors.textColor, fontFamily: 'Outfit' }}
												key={index}
											>
												{content}
											</Text>

											{list_items.map((item) => (
												<View
													key={index + item}
													style={{
														flexDirection: 'row',
														columnGap: 8,
														marginLeft: 8,
														paddingRight: 20
													}}
												>
													<Circle
														strokeWidth={0}
														fill={Colors.textColor}
														style={{ marginTop: 7 }}
														size={6}
													/>
													<Text
														style={{
															color: Colors.textColor + '9a',
															lineHeight: 20,
															fontFamily: 'Outfit'
														}}
													>
														{item}
													</Text>
												</View>
											))}

											{additional_content && (
												<Text
													style={{ color: Colors.textColor + '9a', fontFamily: 'Outfit' }}
												>
													{additional_content}
												</Text>
											)}
										</View>
									)
								)}
							</View>
						)}
					</View>
				))}
			</ScrollView>
		</>
	);
}
