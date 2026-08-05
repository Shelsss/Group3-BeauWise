import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TermsOfService from '@/constants/TermsOfService';
import { ChevronLeft, Circle } from 'lucide-react-native';
import PagePadding from '@/constants/PagePadding';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';
import PrivacyPolicy from '@/constants/PrivacyPolicy';
import MedicalDisclaimer from '@/constants/MedicalDisclaimer';
import ContactUs from '@/constants/ContactUs';
import AboutUs from '@/constants/AboutUs';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';

export default function LegalSupportType() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

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
			<View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: 15,
					paddingTop: 70,
					paddingBottom: styles.spacing.double_xxl + 5,
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					onPress={router.back}
					style={{
						paddingRight: styles.spacing.xxl
					}}
				>
					<ChevronLeft color={styles.icon.colors._05} size={styles.icon.size.xl} />
				</TouchableOpacity>

				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.xl,
						fontWeight: styles.font.weight.bold,
						color: styles.font.colors._04
					}}
				>
					{pageName}
				</Text>
			</View>

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
				{/* {legalSupportType === 'about-us' && <Logo size={80} />} */}

				{displayItem.map((item, index) => (
					<View key={item.title}>
						<Text
							style={{
								fontWeight: styles.font.weight.bold,
								fontSize: styles.font.size.lg,
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family
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
											color: styles.theme.colors[activeTheme].text_secondary,
											lineHeight: 20,
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md
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
											fill={styles.theme.colors[activeTheme].icon}
											style={{ marginTop: 7 }}
											size={6}
										/>
										<Text
											style={{
												color: styles.theme.colors[activeTheme].text_secondary,
												lineHeight: 20,
												fontFamily: styles.font.family,
												fontSize: styles.font.size.md
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
											color: styles.theme.colors[activeTheme].text_secondary,
											lineHeight: 20,
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md
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
													color: styles.theme.colors[activeTheme].text,
													fontWeight: styles.font.bold,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md
												}}
											>
												{title}
											</Text>

											<Text
												style={{
													color: styles.theme.colors[activeTheme].text,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md
												}}
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
														fill={styles.theme.colors[activeTheme].icon}
														style={{ marginTop: 7 }}
														size={6}
													/>
													<Text
														style={{
															color: styles.theme.colors[activeTheme].text_secondary,
															lineHeight: 20,
															fontFamily: styles.font.family,
															fontSize: styles.font.size.md
														}}
													>
														{item}
													</Text>
												</View>
											))}

											{additional_content && (
												<Text
													style={{
														color: styles.theme.colors[activeTheme].text_secondary,
														fontFamily: styles.font.family,
														fontSize: styles.font.size.md
													}}
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
