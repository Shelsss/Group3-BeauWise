import Skeleton from '@/components/Skeleton';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/useThemeStore';

import { Image, useImage } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ name, description, id, onPress, cacheImageTag, imageId }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const image = useImage(
		`https://${process.env.EXPO_PUBLIC_BEAUWISE_CDN}/learn/cosmetic_guides/${imageId}.webp?q=${cacheImageTag}`,
		{
			onError: (_, retry) => {
				retry();
			}
		}
	);
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				flex: 1,
				columnGap: 12,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderWidth: 1,
				borderRadius: styles.border.radius.size.md,
				padding: styles.spacing.xxl
			}}
		>
			{!image ? (
				<Skeleton width={30} height={30} />
			) : (
				<Image
					style={{
						aspectRatio: 1,
						width: 30
					}}
					contentFit='contain'
					transition={{
						duration: 200,
						effect: 'cross-dissolve'
					}}
					recyclingKey={id}
					cachePolicy='memory-disk'
					source={image}
				/>
			)}

			<View>
				<Text
					style={{
						color: styles.theme.colors[activeTheme].text,
						fontWeight: styles.font.weight.semi_bold,
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family
					}}
				>
					{name}
				</Text>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={{
						color: styles.theme.colors[activeTheme].text_secondary,
						width: 180,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md
					}}
				>
					{description}
				</Text>
			</View>

			<ChevronRight
				size={styles.icon.size.lg}
				strokeWidth={1.5}
				color={styles.theme.colors[activeTheme].icon}
				style={{ marginLeft: 'auto' }}
			/>
		</TouchableOpacity>
	);
}
