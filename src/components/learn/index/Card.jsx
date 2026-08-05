import { ArrowRight, Lightbulb } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';
import { Image } from 'expo-image';

export default function Card({ name, description, buttonText, icon, onPress }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<View
			style={{
				alignSelf: 'center',
				width: '92%',
				padding: styles.spacing.one_xxl,
				borderRadius: styles.border.radius.size.sm,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderWidth: 1,
				rowGap: styles.spacing.xl
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					columnGap: styles.spacing.lg
				}}
			>
				{icon(styles.icon.size.xl, styles.theme.colors.primary)}

				<Text
					style={{
						color: styles.theme.colors[activeTheme].text,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md,
						fontWeight: styles.font.weight.semi_bold
					}}
				>
					{name}
				</Text>
			</View>
			<Text
				style={{
					color: styles.theme.colors[activeTheme].text_secondary,
					fontFamily: styles.font.family,
					fontSize: styles.font.size.sm,
					fontWeight: styles.font.weight.regular
				}}
			>
				{description}
			</Text>
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.7}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					columnGap: styles.spacing.sm,
					flexDirection: 'row',
					backgroundColor: styles.theme.colors.primary,
					borderRadius: styles.border.radius.size.sm,
					paddingVertical: styles.spacing.xl
				}}
			>
				<Text
					style={{
						textTransform: 'capitalize',
						textAlign: 'center',
						color: styles.font.colors._04,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						fontWeight: styles.font.weight.regular
					}}
				>
					{buttonText}
				</Text>
				<ArrowRight size={styles.icon.size.md} color={styles.icon.colors._05} />
			</TouchableOpacity>
		</View>
	);
}
