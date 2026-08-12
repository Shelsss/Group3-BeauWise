import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { auth } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useGlobalSearchParams } from 'expo-router';
import { ChevronDown, ChevronLeft, Circle, LockKeyhole } from 'lucide-react-native';
import React, { useState, useCallback, useRef, useEffect, memo, Fragment } from 'react';
import {
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View
} from 'react-native';
import Animated, {
	FadeInDown,
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	LinearTransition,
	FadeOut,
	useAnimatedRef,
	useAnimatedScrollHandler,
	scrollTo
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Warn from '../icons/hugeicons/Warn';
import { staggerCardAnimation } from '@/utility/animations';
import Warn2 from '../icons/hugeicons/Warn2';
import Check from '../icons/hugeicons/Check';
import TestTube from '../icons/hugeicons/TestTube';
import TestTube2 from '../icons/hugeicons/TestTube2';
import LightBulb from '../icons/hugeicons/LightBulb';

const ingredientsData = [
	{
		title: 'Restricted / Regulatory Warning',
		color: '#EF4444',
		flag: 'restricted',
		icon: (size, color) => <Warn2 size={size} color={color} />,
		data: []
	},
	{
		title: 'Needs Attention',
		color: '#F59E0B',
		flag: 'attention',
		icon: (size, color) => <Warn size={size} color={color} />,
		data: []
	},
	{
		title: 'Aligned with Your Profile',
		color: '#22C55E',
		flag: 'aligned',
		icon: (size, color) => <Check size={size} color={color} />,
		data: []
	},
	{
		title: 'Other Base Ingredients',
		color: styles.theme.colors.primary,
		icon: (size, color) => <TestTube2 size={size} color={color} />,
		flag: 'base',
		data: []
	},
	{
		title: 'Suggested Ingredients to Explore',
		flag: 'suggested',
		color: '#3B82F6',
		icon: (size, color) => <LightBulb size={size} color={color} />,
		data: []
	}
	// {
	// 	title: 'Unrecognized / Pending Verification',
	// 	data: []
	// }
];

export default function Results({ analyzedIngredients, product, isHistoryView = false }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const scrollRef = useAnimatedRef(null);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			if (e.contentOffset.y < 0) {
				scrollTo(scrollRef, 0, 0, true);
			}
		}
	});

	ingredientsData.forEach((item, index) => {
		ingredientsData[index].data =
			analyzedIngredients?.filter((ingredient) => ingredient.flag === item.flag) || [];
	});

	return (
		<>
			<Animated.ScrollView
				ref={scrollRef}
				onScroll={scrollHandler}
				layout={LinearTransition.springify().damping(180)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					margin: styles.spacing.double_xl
				}}
			>
				<View
					style={{
						marginTop: styles.spacing.md,
						rowGap: styles.spacing.lg
					}}
				>
					<Text
						style={{
							fontFamily: styles.font.family,
							textAlign: 'center',
							fontWeight: styles.font.weight.semi_bold,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Product Information
					</Text>

					<View
						style={{
							rowGap: styles.spacing.one_xl
						}}
					>
						{Object.keys(product).map((key) => (
							<View key={key} style={{ rowGap: styles.spacing.md }}>
								{product[key]?.length > 0 && (
									<Text
										style={{
											textTransform: 'capitalize',
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{key}
									</Text>
								)}

								{product[key]?.length > 0 && (
									<View
										style={{
											borderRadius: styles.border.radius.size.sm,
											backgroundColor: styles.theme.colors[activeTheme].input_background
										}}
									>
										<Text
											style={{
												fontFamily: styles.font.family,
												fontSize: styles.font.size.md,
												padding: styles.spacing.xxl,
												color: styles.theme.colors[activeTheme].text_secondary
											}}
										>
											{product[key]}
										</Text>
									</View>
								)}
							</View>
						))}
					</View>
				</View>

				<Text
					style={{
						marginBlock: styles.spacing.double_xl,
						fontFamily: styles.font.family,
						textAlign: 'center',
						fontWeight: styles.font.weight.semi_bold,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					Ingredient Analysis
				</Text>

				<View
					style={{
						marginTop: styles.spacing.three_xxl,
						paddingBottom: styles.spacing.three_xxl * 2,
						rowGap: styles.spacing.three_xxl * 1.2
					}}
				>
					{ingredientsData.map(({ data, color, title, icon }, index) => {
						return (
							data?.length > 0 && (
								<ResultCard
									activeTheme={activeTheme}
									items={[...data]}
									key={`title-${index}`}
									title={title}
									color={color}
									parentIndex={index}
									icon={icon}
								/>
							)
						);
					})}

					<TouchableOpacity
						onPress={router.back}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							alignSelf: 'center',
							marginTop: styles.spacing.lg,
							backgroundColor: styles.theme.colors.primary,
							width: '100%',
							paddingVertical: styles.spacing.xl,
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								textTransform: 'capitalize',
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md,
								color: styles.font.colors._04
							}}
						>
							{isHistoryView ? 'Back' : 'Analyze Another Product'}
						</Text>
					</TouchableOpacity>
				</View>
			</Animated.ScrollView>
		</>
	);
}

function ResultCard({ color, activeTheme, parentIndex, items, title, icon }) {
	const [cardVisible, setCardVisible] = useState(() => (parentIndex <= 2 ? true : false));
	const [remainingCardVisible, setRemainingCardVisible] = useState(false);

	const handleCards = () => setCardVisible((prev) => !prev);

	const handleRemainingCards = () => {
		setRemainingCardVisible((prev) => !prev);
	};

	return (
		<Animated.View
			layout={LinearTransition.springify().damping(180)}
			entering={staggerCardAnimation(parentIndex)}
		>
			<TouchableOpacity
				onPress={handleCards}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					columnGap: styles.spacing.md
				}}
			>
				<Circle size={styles.icon.size.xs} color={color} fill={color} />
				<Text
					style={{
						color: color,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md
					}}
				>
					{title}
				</Text>

				<Text
					style={{
						borderRadius: styles.border.radius.size.pill,
						paddingVertical: 1.4,
						paddingHorizontal: styles.spacing.lg,
						backgroundColor: color,
						color: styles.font.colors._04,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm
					}}
				>
					{items?.length}
				</Text>

				<Animated.View
					style={{
						marginLeft: 'auto',
						marginRight: styles.spacing.xs,
						transform: [{ rotateZ: cardVisible ? '180deg' : '0deg' }],
						transitionDuration: 200
					}}
				>
					<ChevronDown
						size={styles.icon.size.xl}
						strokeWidth={1.5}
						color={styles.theme.colors[activeTheme].icon}
					/>
				</Animated.View>
			</TouchableOpacity>

			<View style={{ marginTop: styles.spacing.lg, rowGap: styles.spacing.md }}>
				{items?.map((item, index) => {
					return (
						<Fragment key={`${item?.ingredient}-body`}>
							{index <= 2 && cardVisible && (
								<Animated.View
									entering={staggerCardAnimation(index)}
									exiting={FadeOut.duration(160)}
									key={item?.ingredient}
									style={{
										borderRadius: styles.border.radius.size.sm,
										padding: styles.spacing.xxl,
										backgroundColor: activeTheme === 'light' ? '#f6f6f6' : '#1E293B'
									}}
								>
									<View style={{ flexDirection: 'row', columnGap: styles.spacing.xxl }}>
										<View style={{ marginTop: styles.spacing.sm }}>
											{icon(styles.icon.size.xl, color)}
										</View>

										<View>
											<Text
												style={{
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md,
													color: styles.theme.colors[activeTheme].text
												}}
											>
												{item?.ingredient}
											</Text>
											<Text
												style={{
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md,
													color: styles.theme.colors[activeTheme].text_secondary,
													paddingRight: styles.spacing.double_xxl
												}}
											>
												{item?.description}
											</Text>
										</View>
									</View>
								</Animated.View>
							)}

							{index > 2 && remainingCardVisible && cardVisible && (
								<Animated.View
									entering={staggerCardAnimation(index)}
									exiting={FadeOut}
									key={item?.ingredient}
									style={{
										borderRadius: styles.border.radius.size.sm,
										padding: styles.spacing.xxl,
										backgroundColor: activeTheme === 'light' ? '#f0f0f0' : '#1E293B'
									}}
								>
									<View style={{ flexDirection: 'row', columnGap: styles.spacing.xxl }}>
										<View style={{ marginTop: styles.spacing.sm }}>
											{icon(styles.icon.size.xl, color)}
										</View>

										<View>
											<Text
												style={{
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md,
													color: styles.theme.colors[activeTheme].text
												}}
											>
												{item?.ingredient}
											</Text>
											<Text
												style={{
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md,
													color: styles.theme.colors[activeTheme].text_secondary,
													paddingRight: styles.spacing.double_xxl
												}}
											>
												{item?.description}
											</Text>
										</View>
									</View>
								</Animated.View>
							)}
						</Fragment>
					);
				})}

				{items?.length > 3 && cardVisible && (
					<TouchableOpacity
						onPress={handleRemainingCards}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.lg,
							alignItems: 'center',
							backgroundColor: activeTheme === 'light' ? '#f0f0f0' : '#1E293B'
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{remainingCardVisible ? 'Show Less' : `Show ${items?.length - 3} More`}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</Animated.View>
	);
}
