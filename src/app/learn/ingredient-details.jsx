import CircleCheckFill from '@/components/icons/CircleCheckFill';
import Colors from '@/constants/Colors';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	FlaskConical,
	Info,
	X
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import Disclaimer from '@/components/learn/ingredients-glossary/Disclaimer';
import styles from '@/config/styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '@/stores/useThemeStore';
import Animated, {
	Easing,
	FadeIn,
	FadeInDown,
	FadeOut,
	LinearTransition,
	scrollTo,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import TestTube2 from '@/components/icons/hugeicons/TestTube2';
import WarnFill from '@/components/icons/WarnFill';
import { useCallback, useRef, useState } from 'react';
import Check from '@/components/icons/hugeicons/Check';
import Notepad from '@/components/icons/hugeicons/Notepad';
import Book from '@/components/icons/hugeicons/Book';
import Document from '@/components/icons/hugeicons/Document';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { openBrowserAsync } from 'expo-web-browser';
import LinkCirlcle from '@/components/icons/hugeicons/LinkCircle';
import { useBackHandler } from '@react-native-community/hooks';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc } from '@react-native-firebase/firestore';
import { db } from '@/services/firestore';
import Skeleton from '@/components/Skeleton';
import Flag from '@/components/icons/hugeicons/Flag';
import Zzz from '@/components/icons/hugeicons/Zzz';
import Sleeping from '@/components/icons/hugeicons/Sleeping';
import { staggerCardAnimation } from '@/utility/animations';
import RetryError from '@/components/RetryError';

export default function IngredientDetails() {
	const params = useLocalSearchParams();

	const item = JSON.parse(params.item);

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const { dismiss } = useBottomSheetModal();

	const scrollRef = useAnimatedRef(null);
	const sheetRef = useRef(null);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			if (e.contentOffset.y < 0) {
				scrollTo(scrollRef, 0, 0, true);
			}
		}
	});

	const renderBackdrop = useCallback(
		(props) => (
			<>
				<BottomSheetBackdrop
					{...props}
					opacity={1.8}
					disappearsOnIndex={-1}
					pressBehavior='none'
				/>
			</>
		),
		[]
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	useBackHandler(() => {
		return dismiss();
	}, []);

	return (
		<>
			<View
				style={{
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
			>
				<View
					style={{
						backgroundColor: styles.theme.colors.primary,
						paddingHorizontal: 15,
						paddingTop: 62,
						paddingBottom: styles.spacing.double_xxl,
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

					<View>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.xl,
								fontWeight: styles.font.weight.bold,
								color: styles.font.colors._04
							}}
						>
							Learn
						</Text>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.light,
								color: styles.font.colors._04
							}}
						>
							{item?.name}
						</Text>
					</View>
				</View>
			</View>

			<Animated.ScrollView
				entering={FadeIn}
				ref={scrollRef}
				onScroll={scrollHandler}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					margin: styles.spacing.one_xl,
					paddingBottom: styles.spacing.three_xxl * 2.6
				}}
			>
				<Animated.View
					style={{
						marginVertical: styles.spacing.double_xxl,
						alignItems: 'center',
						rowGap: styles.spacing.md
					}}
				>
					<View style={{ alignItems: 'center' }}>
						<TestTube2
							color={styles.theme.colors.primary}
							size={styles.icon.size.xl * 2}
						/>
					</View>

					<Text
						style={{
							fontSize: styles.font.size.md,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text,
							fontWeight: styles.font.weight.semi_bold
						}}
					>
						{item.name}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							gap: styles.spacing.md,
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						{item.categories.map((category) => (
							<Text
								style={{
									height: 20,
									borderRadius: styles.border.radius.size.pill,
									backgroundColor: styles.theme.colors.primary,
									paddingVertical: item.info ? styles.spacing.xs : 2,
									fontFamily: styles.font.family,
									color: styles.font.colors._04,
									fontSize: styles.font.size.sm - 1,
									textAlign: 'center',
									textAlignVertical: 'center',
									paddingHorizontal: styles.spacing.xxl
								}}
								key={category}
							>
								{category}
							</Text>
						))}
					</View>
				</Animated.View>

				<View style={{ rowGap: styles.spacing.xxl }}>
					{item.info && (
						<Animated.View>
							<View
								style={{
									borderRadius: styles.border.radius.size.md,
									padding: styles.spacing.xxl,
									backgroundColor: styles.theme.colors[activeTheme].disclaimer_background,
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].disclaimer_border,
									rowGap: styles.spacing.lg
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										columnGap: styles.spacing.sm
									}}
								>
									<View>
										<WarnFill
											size={styles.icon.size.xl}
											color={styles.theme.colors[activeTheme].disclaimer_icon}
										/>
									</View>

									<Text
										style={{
											color: styles.theme.colors[activeTheme].disclaimer_text,
											fontWeight: styles.font.weight.bold,
											fontFamily: styles.font.family,
											fontSize: styles.font.size.sm
										}}
									>
										Important To Know
									</Text>
								</View>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].disclaimer_text,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									{item.info}
								</Text>
							</View>
						</Animated.View>
					)}

					<Animated.View style={{ rowGap: styles.spacing.xxl }}>
						<CardAccordion title='What It Is' activeTheme={activeTheme}>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{item.what_it_is}
							</Text>
						</CardAccordion>

						<CardAccordion title='What It Does' activeTheme={activeTheme}>
							<View style={{ rowGap: styles.spacing.xxl }}>
								{item.what_it_does.map((item) => (
									<View
										key={item}
										style={{ flexDirection: 'row', columnGap: styles.spacing.md }}
									>
										<View style={{ marginTop: 0 }}>
											<Check
												color={styles.theme.colors.status.green}
												size={styles.icon.size.lg}
											/>
										</View>

										<Text
											style={{
												paddingRight: styles.spacing.three_xxl,
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text,
												fontSize: styles.font.size.sm
											}}
										>
											{item}
										</Text>
									</View>
								))}
							</View>
						</CardAccordion>

						<CardAccordion title='Usage & Common Products' activeTheme={activeTheme}>
							<View style={{ rowGap: styles.spacing.xxl }}>
								<View style={{ rowGap: styles.spacing.sm }}>
									<Text
										style={{
											paddingRight: styles.spacing.three_xxl,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text,
											fontSize: styles.font.size.sm
										}}
									>
										Best For
									</Text>

									<View
										style={{
											flexDirection: 'row',
											flexWrap: 'wrap',
											gap: styles.spacing.md
										}}
									>
										{item.best_for.map((item) => (
											<Text
												style={{
													borderRadius: styles.border.radius.size.pill,
													height: 20,
													backgroundColor: '#22C55E',
													fontFamily: styles.font.family,
													color: styles.font.colors._04,
													fontSize: styles.font.size.sm,
													paddingHorizontal: styles.spacing.lg,
													paddingVertical: styles.spacing.sm
												}}
												key={item}
											>
												{item}
											</Text>
										))}
									</View>
								</View>

								<View style={{ rowGap: styles.spacing.sm }}>
									<Text
										style={{
											paddingRight: styles.spacing.three_xxl,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text,
											fontSize: styles.font.size.sm
										}}
									>
										Common Products
									</Text>

									<View
										style={{
											flexDirection: 'row',
											flexWrap: 'wrap',
											gap: styles.spacing.md
										}}
									>
										{item.common_products.map((item) => (
											<Text
												style={{
													height: 20,
													borderRadius: styles.border.radius.size.pill,
													backgroundColor: '#3B82F6',
													paddingHorizontal: styles.spacing.lg,
													paddingVertical: styles.spacing.sm,
													fontFamily: styles.font.family,
													color: styles.font.colors._04,
													fontSize: styles.font.size.sm,
													textAlign: 'center',
													textAlignVertical: 'center'
												}}
												key={item}
											>
												{item}
											</Text>
										))}
									</View>
								</View>
							</View>
						</CardAccordion>

						<CardAccordion title='Safety Level' activeTheme={activeTheme}>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{item.safety_level}
							</Text>
						</CardAccordion>

						<Animated.View
							layout={LinearTransition.springify().damping(180)}
							style={{
								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								borderRadius: styles.border.radius.size.md,
								rowGap: styles.spacing.lg
							}}
						>
							<TouchableOpacity
								onPress={() => {
									sheetRef.current.present();
								}}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									padding: styles.spacing.xxl,
									columnGap: styles.spacing.sm
								}}
							>
								<Document size={styles.icon.size.lg} color='#3B82F6' />
								<Text
									style={{
										fontWeight: styles.font.weight.bold,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm,
										color: '#3B82F6'
									}}
								>
									Learn More
								</Text>
								<Animated.View
									style={{
										marginLeft: 'auto'
									}}
								>
									<ChevronRight
										size={styles.icon.size.lg}
										strokeWidth={1.5}
										color={'#3B82F6'}
									/>
								</Animated.View>
							</TouchableOpacity>
						</Animated.View>
					</Animated.View>
				</View>
			</Animated.ScrollView>

			<BottomSheetModal
				animationConfigs={animationConfigs}
				backdropComponent={renderBackdrop}
				enableDynamicSizing={true}
				ref={sheetRef}
				handleComponent={() => (
					<Animated.View
						entering={FadeInDown.delay(400)}
						style={{
							alignSelf: 'center',
							marginBottom: styles.spacing.xxl,
							backgroundColor: activeTheme === 'light' ? '#fefefe' : '#0f172abb',
							padding: styles.spacing.md,
							borderRadius: styles.border.radius.size.pill
						}}
					>
						<TouchableOpacity
							onPress={() => {
								dismiss();
							}}
						>
							<X
								size={styles.icon.size.xl}
								color={styles.theme.colors[activeTheme].icon}
								strokeWidth={1.5}
							/>
						</TouchableOpacity>
					</Animated.View>
				)}
				enableOverDrag={false}
				backgroundComponent={null}
			>
				<BottomSheetView>
					<View
						style={{
							paddingBottom: styles.spacing.double_xxl,
							backgroundColor: styles.theme.colors[activeTheme].screen_background
						}}
					>
						<Text
							style={{
								paddingVertical: styles.spacing.xxl,
								textAlign: 'center',
								fontFamily: styles.font.family,
								fontSize: styles.font.size.lg,
								fontWeight: styles.font.weight.semi_bold,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							References
						</Text>

						{item.sources.map((source, index) => (
							<TouchableOpacity
								onPress={() => {
									openBrowserAsync(source.link, {
										showInRecents: false,
										toolbarColor: styles.theme.colors.primary,
										controlsColor: styles.theme.colors.primary,
										showTitle: false
									});
								}}
								key={source.name}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									flexDirection: 'row',
									paddingVertical: styles.spacing.one_xl,
									columnGap: styles.spacing.sm
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.md,
										textAlign: 'center',
										fontFamily: styles.font.family,
										color: '#3B82F6'
									}}
								>
									{source.name}
								</Text>

								<LinkCirlcle color='#3B82F6' size={styles.icon.size.lg} />
							</TouchableOpacity>
						))}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}

function CardAccordion({ children, title, activeTheme }) {
	const [visible, setVisible] = useState(false);

	return (
		<Animated.View
			layout={LinearTransition.springify().damping(180)}
			style={{
				overflow: 'hidden',
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderWidth: 1,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderRadius: styles.border.radius.size.md,
				rowGap: styles.spacing.lg
			}}
		>
			<TouchableOpacity
				onPress={() => setVisible((prev) => !prev)}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: styles.spacing.one_xl,
					paddingHorizontal: styles.spacing.one_xl,
					paddingBottom: visible ? 0 : styles.spacing.one_xl
				}}
			>
				<Text
					style={{
						fontWeight: styles.font.weight.bold,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					{title}
				</Text>
				<Animated.View
					style={{
						marginLeft: 'auto',
						transform: [{ rotateZ: visible ? '180deg' : '0deg' }],
						transitionDuration: 180,
						transitionTimingFunction: 'linear'
					}}
				>
					<ChevronDown
						size={styles.icon.size.lg}
						strokeWidth={1.5}
						color={styles.theme.colors[activeTheme].icon}
					/>
				</Animated.View>
			</TouchableOpacity>
			{visible && (
				<Animated.View
					entering={FadeIn.delay(200)}
					exiting={FadeOut.duration(100)}
					style={{
						paddingHorizontal: styles.spacing.one_xl,
						paddingBottom: styles.spacing.one_xl
					}}
				>
					{children}
				</Animated.View>
			)}
		</Animated.View>
	);
}

const STYLES = StyleSheet.create({
	category: {
		fontFamily: 'Outfit',
		borderRadius: 100,
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 600,
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: Colors.primary + '1a',
		color: Colors.primary,
		textTransform: 'uppercase'
	}
});
