import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { Image } from 'expo-image';
import { Check, ChevronRight, X } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ResumableZoom } from 'react-native-zoom-toolkit';

export default function CardThree({ title, myth, fact, parentId, id }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [visible, setVisible] = useState(false);

	return (
		<Animated.View
			layout={LinearTransition.springify().damping(200)}
			style={{
				padding: styles.spacing.xxl,
				rowGap: styles.spacing.xxl,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderWidth: 1,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderRadius: styles.border.radius.size.sm,

				alignItems: 'center'
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontFamily: styles.font.family,
					fontSize: styles.font.size.md,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				{title}
			</Text>

			<View style={{ aspectRatio: 16 / 9, width: 300 }}>
				<ResumableZoom maxScale={1.6}>
					{/* https://cdn.beauwise.tech/learn/${parentId}/${id}.webp */}
					<Image
						source={``}
						contentFit='contain'
						transition={{
							duration: 200,
							effect: 'cross-dissolve'
						}}
						recyclingKey={id}
						cachePolicy='memory-disk'
						style={{
							alignSelf: 'center',
							backgroundColor: styles.background_color._04,
							borderRadius: styles.border.radius.size.sm,
							borderWidth: 0.5,
							borderColor: activeTheme === 'light' ? '#E8E5F2' : 'transparent',
							width: 260,
							aspectRatio: 16 / 9
						}}
					/>
				</ResumableZoom>
			</View>

			<Animated.View
				style={{
					rowGap: styles.spacing.lg,
					marginHorizontal: styles.spacing.one_xxl + 4,
					zIndex: -2,
					width: '100%'
				}}
			>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setVisible((prev) => !prev)}
					style={{
						borderRadius: styles.border.radius.size.sm,
						backgroundColor: styles.theme.colors.status.red + '2a',
						flexDirection: 'row',
						paddingVertical: styles.spacing.lg,
						paddingHorizontal: styles.spacing.lg,
						marginHorizontal: styles.spacing.xl
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							marginTop: 3.8,
							columnGap: styles.spacing.xs
						}}
					>
						<X
							strokeWidth={1.5}
							size={styles.icon.size.lg}
							color={styles.theme.colors.status.red}
						/>
						<Text
							style={{
								fontSize: styles.font.size.sm,
								fontFamily: styles.font.family,
								color: styles.theme.colors.status.red
							}}
						>
							MYTH:
						</Text>
					</View>

					<Text
						style={{
							marginLeft: styles.spacing.md,
							fontSize: styles.font.size.sm,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text,
							marginRight: 90,
							lineHeight: 20
						}}
					>
						{myth}
					</Text>

					<Animated.View
						style={{
							transform: [
								{
									rotateZ: visible ? '90deg' : '0deg'
								}
							],
							right: 10,
							top: 11.4,
							position: 'absolute',
							marginLeft: 'auto',
							marginRight: styles.spacing.sm,
							transitionDuration: 220
						}}
					>
						<ChevronRight
							size={styles.icon.size.lg}
							strokeWidth={1.5}
							color={styles.theme.colors[activeTheme].icon}
						/>
					</Animated.View>
				</TouchableOpacity>

				{visible && (
					<Animated.View
						entering={FadeIn.delay(120)}
						exiting={FadeOut.duration(80)}
						style={{
							borderRadius: styles.border.radius.size.sm,
							backgroundColor: styles.theme.colors.status.green + '2a',
							flexDirection: 'row',
							paddingVertical: styles.spacing.lg,
							paddingHorizontal: styles.spacing.lg,
							marginHorizontal: styles.spacing.xl
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								marginTop: 3.8,
								columnGap: styles.spacing.xs
							}}
						>
							<Check
								strokeWidth={1.5}
								size={styles.icon.size.lg}
								color={styles.theme.colors.status.green}
							/>
							<Text
								style={{
									fontSize: styles.font.size.sm,
									fontFamily: styles.font.family,
									color: styles.theme.colors.status.green
								}}
							>
								FACT:
							</Text>
						</View>

						<Text
							style={{
								marginLeft: styles.spacing.md,
								fontSize: styles.font.size.sm,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text,
								marginRight: 50,
								lineHeight: 20
							}}
						>
							{fact}
						</Text>
					</Animated.View>
				)}
			</Animated.View>
		</Animated.View>
	);
}
