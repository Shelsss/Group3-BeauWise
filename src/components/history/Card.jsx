import { View, Text, Pressable, useColorScheme } from 'react-native';
import { createAnimatedComponent } from 'react-native-reanimated';
import Camera from '@/components/icons/hugeicons/Camera';
import InputNumeric from '@/components/icons/hugeicons/InputNumeric';
import ShieldCheck from '@/components/icons/hugeicons/ShieldCheck';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';
import ArrowRight from '../icons/hugeicons/ArrowRight';
const AnimatedPressable = createAnimatedComponent(Pressable);

export default function Card({
	title,
	secondaryText,
	secondaryTextColor,
	type = 'default',
	onPress
}) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<AnimatedPressable
			onPress={onPress}
			android_ripple={{ color: '#9797976a', foreground: true }}
			style={[
				{
					borderRadius: styles.border.radius.size.md,
					borderWidth: 1,
					borderColor: styles.theme.colors[activeTheme].card_border,
					backgroundColor: styles.theme.colors[activeTheme].card_background,
					padding: styles.spacing.xl,

					flexDirection: 'row',
					alignItems: 'center',
					columnGap: 10,
					overflow: 'hidden'
				}
			]}
		>
			{type === 'batch' ? (
				<View
					style={{
						marginHorizontal: 8,
						borderRadius: 12
					}}
				>
					<InputNumeric
						size={styles.icon.size.xl * 1.2}
						color={styles.theme.colors.batch}
					/>
				</View>
			) : type === 'fda' ? (
				<View
					style={{
						marginHorizontal: 8,
						borderRadius: 12
					}}
				>
					<ShieldCheck size={styles.icon.size.xl * 1.2} color={styles.theme.colors.fda} />
				</View>
			) : (
				<View style={{ marginHorizontal: 8, borderRadius: 12 }}>
					<Camera size={styles.icon.size.xl * 1.2} color={styles.theme.colors.primary} />
				</View>
			)}
			<View>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md,
						fontWeight: styles.font.weight.bold,
						color: styles.theme.colors[activeTheme].text,
						width: 170
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						color: secondaryTextColor
							? secondaryTextColor
							: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					{secondaryText}
				</Text>
			</View>
			<View style={{ marginLeft: 'auto' }}>
				<View
					style={[
						{
							padding: 8,
							borderRadius: 10
						}
					]}
				>
					<ArrowRight
						size={styles.icon.size.lg}
						color={styles.theme.colors[activeTheme].icon}
					/>
				</View>
			</View>
		</AnimatedPressable>
	);
}
