import Header from '@/components/batch/Header';
import ResultCard from '@/components/scanner/ResultCard';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { auth } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { router, useGlobalSearchParams } from 'expo-router';
import { ChevronDown, LockKeyhole } from 'lucide-react-native';
import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
	FadeInDown,
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ingredientsData = [
	{
		title: 'Restricted / Regulatory Warning',
		data: []
	},
	{
		title: 'Aligned with Your Profile',
		hasKeyFlag: true,
		noFlags: {
			title: 'No highly targeted ingredients detected.',
			description:
				'Based on standard cosmetic literature, the system did not identify specific active ingredients in this formulation that actively target your selected profile concerns.'
		},

		data: []
	},
	{
		title: 'Needs Attention (Based on your selections)',
		noFlags: {
			title: 'No profile conflicts flagged by the system.',
			description:
				'Based on our referenced dermatological literature, the algorithm did not identify specific ingredients that conflict with your profile. Please note that this does not guarantee the product is completely risk-free, as individual allergies and unlisted chemical interactions can still occur.'
		},
		data: []
	},
	{
		title: 'Unrecognized / Pending Verification',
		data: []
	},
	{
		title: 'Other Base Ingredients',
		alternativeTitle: 'Component Overview',
		alternativeDescription:
			'Standard functions of the detected ingredients based on established cosmetic literature:',
		data: []
	},
	{
		title: 'Suggested Ingredients to Explore',
		description:
			'Based on the preferences and concerns you selected during your profiling, here are some ingredients generally known in cosmetic literature to be beneficial:',
		data: []
	}
];

const AnimatedSectionItem = ({ isVisible, children }) => {
	const opacity = useSharedValue(0);
	const translateY = useSharedValue(20);

	useEffect(() => {
		if (isVisible) {
			opacity.value = withTiming(1, { duration: 400 });
			translateY.value = withTiming(0, { duration: 400 });
		}
	}, [isVisible]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateY: translateY.value }]
	}));

	return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// eslint-disable-next-line react/display-name
const renderHeader = memo(() => {
	const { name, brand, notes, flaggedIngredients } = useGlobalSearchParams();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const flagged_ingredients = JSON.parse(flaggedIngredients);
	ingredientsData[0].data =
		flagged_ingredients.filter((ingredient) => ingredient.status === 'restricted') || [];
	ingredientsData[1].data =
		flagged_ingredients.filter((ingredient) => ingredient.status === 'aligned') || [];
	ingredientsData[2].data =
		flagged_ingredients.filter((ingredient) => ingredient.status === 'attention') || [];
	ingredientsData[3].data =
		flagged_ingredients.filter((ingredient) => ingredient.status === 'unrecognized') ||
		[];
	ingredientsData[4].data =
		flagged_ingredients.filter((ingredient) => ingredient.status === 'base') || [];

	return (
		<View style={{ paddingBottom: 20 }}>
			<Animated.View
				entering={FadeInDown.delay(50).duration(400)}
				style={{
					backgroundColor: '#E8F5E9',
					padding: 20,
					borderRadius: 16,
					marginVertical: 20
				}}
			>
				<Text style={{ fontSize: 12, color: Colors.textColor, lineHeight: 18 }}>
					<Text style={{ fontWeight: 600, color: Colors.textColor }}>Disclaimer: </Text>
					This analysis identifies individual cosmetic-grade ingredients based on standard
					literature (such as FDA guidelines, the ASEAN Cosmetic Directive, and
					established comedogenic scales). It does not account for complex chemical
					interactions when these ingredients are formulated together. These ingredients
					have no approved therapeutic claims. Always patch-test and consult a
					board-certified dermatologist before incorporating new products into your
					routine.
				</Text>
			</Animated.View>

			<Animated.View
				entering={FadeInDown.delay(60).duration(400)}
				style={STYLES.productContainer}
			>
				<Text style={{ color: Colors.textColor, fontWeight: 700 }}>
					Product Information
				</Text>
				<View style={{ rowGap: 8 }}>
					<View>
						<Text style={[STYLES.productTextTitle]}>name</Text>
						<Text style={[STYLES.productText]}>{name}</Text>
					</View>

					{brand?.length > 0 && (
						<View>
							<Text style={[STYLES.productTextTitle]}>brand</Text>
							<Text style={[STYLES.productText]}>{brand}</Text>
						</View>
					)}

					{notes?.length > 0 && (
						<View>
							<Text style={[STYLES.productTextTitle]}>notes</Text>
							<Text style={[STYLES.productText]}>{notes}</Text>
						</View>
					)}
				</View>
			</Animated.View>

			<Animated.Text
				entering={FadeInDown.delay(70).duration(400)}
				style={{
					marginTop: 40,
					color: Colors.textColor,
					fontSize: 18,
					fontWeight: 700,
					textAlign: 'center'
				}}
			>
				{isAuthenticated ? 'Ingredient Analysis' : 'General Ingredient Breakdown'}
			</Animated.Text>
		</View>
	);
});

export default function Results() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { bottom } = useSafeAreaInsets();

	const scrollViewRef = useRef(null);
	const [visibleKeys, setVisibleKeys] = useState({});

	const [activeIndexSection, setActiveIndexSection] = useState(null);

	const onViewableItemsChanged = useCallback(({ viewableItems }) => {
		setVisibleKeys((prev) => {
			const next = { ...prev };
			viewableItems.forEach((v) => {
				if (v.isViewable) {
					next[v.key] = true;
				}
			});
			return next;
		});
	}, []);

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 30,
		minimumViewTime: 5
	}).current;

	const getHeaderColor = (title) => {
		if (title.includes('Restricted')) return '#ff8183';
		if (title.includes('Aligned')) return '#20c997';
		if (title.includes('Attention')) return '#ffc53d';
		if (title.includes('Other Base')) return Colors.primary;
		if (title.includes('Suggested')) return '#00ACC1';
		return Colors.textColor;
	};

	const handleActiveIndex = (selectedActiveIndex) => () => {
		setActiveIndexSection((currentActiveIndex) => {
			return currentActiveIndex !== selectedActiveIndex ? selectedActiveIndex : null;
		});
	};
	return (
		<>
			<Header title={'Analysis'} />

			<SectionList
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				sections={ingredientsData}
				keyExtractor={(item, index) => item.ingredientName + index}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={viewabilityConfig}
				contentContainerStyle={{
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingBottom: bottom + 30
				}}
				ListHeaderComponent={renderHeader}
				renderSectionHeader={({
					section: {
						title,
						alternativeTitle,
						description,
						alternativeDescription,
						data,
						hasKeyFlag
					}
				}) => {
					if (
						!isAuthenticated &&
						!title.includes('Other Base') &&
						!title.includes('Restricted')
					) {
						return null;
					}

					if (data?.length === 0 && title.includes('Pending')) return null;
					return (
						<View style={{ marginTop: 20, borderStartColor: 'red' }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										color: getHeaderColor(title),
										fontSize: 16,
										fontWeight: 700
									}}
								>
									{(!isAuthenticated && title.includes('Restricted')) || isAuthenticated
										? title
										: alternativeTitle}
								</Text>

								{hasKeyFlag && isAuthenticated && (
									<Text
										style={{
											marginLeft: 'auto',
											color: Colors.textColor + '7a',
											fontSize: 12,
											fontWeight: 700,
											textTransform: 'uppercase'
										}}
									>
										{data.length} key flagged
									</Text>
								)}
							</View>

							{description?.length > 0 ||
								(!isAuthenticated && title.includes('Other Base') && (
									<Text
										style={{
											color: Colors.textColor + '7a',
											fontSize: 12,
											lineHeight: 18
										}}
									>
										{alternativeDescription}
									</Text>
								))}
						</View>
					);
				}}
				renderItem={({ item, index, section }) => {
					const itemKey = item.ingredientName + index;
					const numberOfItems = section.data.length;

					const firstThreeItemsOnly = index < 3;
					const succeedingItems = index >= 3;
					const indexOfSection = ingredientsData.indexOf(section);
					const showOnLastItem = numberOfItems - 1 === index;

					const isActive = activeIndexSection === indexOfSection;

					if (
						!isAuthenticated &&
						!section.title.includes('Other Base') &&
						!section.title.includes('Restricted')
					) {
						return null;
					}

					return numberOfItems > 3 ? (
						<View>
							{firstThreeItemsOnly && (
								<AnimatedSectionItem isVisible={visibleKeys[itemKey]}>
									<View style={{ marginTop: 8 }}>
										<ResultCard
											status={item.status}
											name={item.ingredientName}
											description={item.ingredientDescription}
										/>
									</View>
								</AnimatedSectionItem>
							)}

							{succeedingItems && (
								<>
									{isActive && (
										<AnimatedSectionItem isVisible={visibleKeys[itemKey]}>
											<View style={{ marginTop: 8 }}>
												<ResultCard
													status={item.status}
													name={item.ingredientName}
													description={item.ingredientDescription}
												/>
											</View>
										</AnimatedSectionItem>
									)}
								</>
							)}

							{showOnLastItem && index > 2 && (
								<TouchableOpacity
									onPress={handleActiveIndex(indexOfSection)}
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										columnGap: 4,
										paddingTop: 14
									}}
								>
									<Text style={{ color: Colors.textColor, fontWeight: 800 }}>
										Show {isActive ? 'Less' : 'More'}
									</Text>

									<ChevronDown
										size={12}
										style={{ transform: [{ rotate: isActive ? '180deg' : '360deg' }] }}
									/>
								</TouchableOpacity>
							)}
						</View>
					) : (
						<AnimatedSectionItem isVisible={visibleKeys[itemKey]}>
							<View style={{ marginTop: 8 }}>
								<ResultCard
									status={item.status}
									name={item.ingredientName}
									description={item.ingredientDescription}
								/>
							</View>
						</AnimatedSectionItem>
					);
				}}
				renderSectionFooter={({ section }) => {
					if (!isAuthenticated) return;

					if (
						section.data.length === 0 &&
						(section.title.includes('Attention') || section.title.includes('Profile'))
					) {
						return (
							<View
								style={[
									STYLES.shadow,
									{
										marginTop: 8,
										backgroundColor: Colors.backgroundColor,
										padding: 16,
										borderRadius: 12
									}
								]}
							>
								<Text style={{ fontSize: 14, fontWeight: 700, color: Colors.textColor }}>
									{section.noFlags.title}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: Colors.textColor,
										paddingRight: 20,
										lineHeight: 18
									}}
								>
									{section.noFlags.description}
								</Text>
							</View>
						);
					}

					return null;
				}}
				ListFooterComponent={() => {
					if (!isAuthenticated) {
						return (
							<View
								style={[
									{
										alignItems: 'center',
										backgroundColor: Colors.backgroundColor,
										borderRadius: 16,
										padding: 24,
										marginTop: 20
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
										Unlock Personalized Analysis
									</Text>
									<Text style={{ color: Colors.textColor + '9a', textAlign: 'center' }}>
										Want to see how these ingredients align with your personal cosmetic
										profile? BeauWise can cross-reference this product against your
										self-reported skin and hair traits to highlight ingredients that fit
										your preferences or those that may need your attention.
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
						);
					}
				}}
			/>
		</>
	);
}

const STYLES = StyleSheet.create({
	productContainer: {
		rowGap: 10,
		backgroundColor: Colors.backgroundColor,
		padding: 20,
		borderRadius: 16,
		shadowColor: '#00000050',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2
	},
	productTextTitle: {
		color: Colors.textColor + '9a',
		fontSize: 12,
		textTransform: 'uppercase',
		fontWeight: 600
	},
	productText: {
		textTransform: 'capitalize',
		color: Colors.textColor,
		fontSize: 12
	},
	shadow: {
		shadowColor: '#00000048',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2
	}
});
