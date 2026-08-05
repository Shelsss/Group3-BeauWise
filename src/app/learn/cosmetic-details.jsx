import Document from '@/components/icons/hugeicons/Document';
import LinkCirlcle from '@/components/icons/hugeicons/LinkCircle';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { useBackHandler } from '@react-native-community/hooks';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { ChevronLeft, X } from 'lucide-react-native';
import { useCallback, useRef } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function CosmeticDetails() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const params = useLocalSearchParams();
	const item = JSON.parse(params.item);

	const { dismiss } = useBottomSheetModal();

	const sheetRef = useRef(null);

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

			<Animated.View
				style={{
					flex: 1,
					alignItems: 'center',
					padding: styles.spacing.double_xl,
					rowGap: styles.spacing.three_xxl * 1.8,
					marginTop: '20%'
				}}
			>
				<View
					style={{
						padding: 20,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: activeTheme === 'light' ? 'transparent' : '#fff',
						borderRadius: styles.border.radius.size.sm
					}}
				>
					<Image
						style={{
							aspectRatio: 1,
							width: 100
						}}
						contentFit='contain'
						transition={{
							duration: 200,
							effect: 'cross-dissolve'
						}}
						recyclingKey={item.id}
						cachePolicy='memory-disk'
						source={`https://cdn.beauwise.tech/learn/cosmetic_guides/${item.id}.webp`}
					/>
				</View>

				<View style={{ rowGap: styles.spacing.xs }}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.lg,
							textAlign: 'center',
							fontWeight: styles.font.weight.semi_bold,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{item.name}
					</Text>

					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							fontWeight: styles.font.weight.light,
							textAlign: 'center',
							lineHeight: 20,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						{item.definition}
					</Text>
				</View>

				<View style={{ rowGap: styles.spacing.xs }}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.lg,
							fontWeight: styles.font.weight.semi_bold,
							textAlign: 'center',
							color: styles.theme.colors[activeTheme].text
						}}
					>
						How To Read & Use
					</Text>

					<Text
						style={{
							textAlign: 'center',
							lineHeight: 20,
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							fontWeight: styles.font.weight.light,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						{item.usage}
					</Text>
				</View>
			</Animated.View>

			<Source sheetRef={sheetRef} />
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

function Source({ sheetRef }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<Animated.View
			style={{
				alignSelf: 'flex-end',
				bottom: 60,
				right: 22,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderWidth: 1,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderRadius: styles.border.radius.size.pill,

				position: 'absolute',
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
				<Document size={styles.icon.size.xl * 1.2} color='#3B82F6' />
			</TouchableOpacity>
		</Animated.View>
	);
}
