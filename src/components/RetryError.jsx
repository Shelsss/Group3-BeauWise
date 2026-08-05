import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Sleeping from './icons/hugeicons/Sleeping';
import styles from '@/config/styles';
import { staggerCardAnimation } from '@/utility/animations';
import { useThemeStore } from '@/stores/useThemeStore';
import Ccw from './icons/hugeicons/Ccw';

export default function RetryError({ refetch }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<View style={{ flex: 1, alignItems: 'center', marginTop: '60%' }}>
			<View style={{ alignItems: 'center', rowGap: styles.spacing.sm }}>
				<Animated.View entering={staggerCardAnimation(1.4)}>
					<Sleeping
						size={styles.icon.size.xl * 2.4}
						color={styles.theme.colors[activeTheme].icon}
					/>
				</Animated.View>

				<Animated.Text
					entering={staggerCardAnimation(2)}
					style={{
						color: styles.theme.colors[activeTheme].text,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.semi_bold
					}}
				>
					Hang tight, let's try that again
				</Animated.Text>
				<Animated.Text
					entering={staggerCardAnimation(3)}
					style={{
						color: styles.theme.colors[activeTheme].text,
						width: 300,
						fontSize: styles.font.size.md,
						textAlign: 'center',
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.light
					}}
				>
					Our system got a bit tangled up responding to your request. Click below to
					resend it.
				</Animated.Text>
			</View>

			<Animated.View
				entering={staggerCardAnimation(4)}
				style={{
					borderRadius: styles.border.radius.size.sm,
					paddingVertical: styles.spacing.lg,
					paddingHorizontal: styles.spacing.xxl,
					marginTop: styles.spacing.xl,
					backgroundColor: styles.theme.colors.primary
				}}
			>
				<TouchableOpacity
					onPress={refetch}
					activeOpacity={0.7}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: styles.spacing.sm
					}}
				>
					<Text
						style={{
							color: styles.font.colors._04,
							fontSize: styles.font.size.md,
							textAlign: 'center',
							fontFamily: styles.font.family,
							fontWeight: styles.font.weight.light
						}}
					>
						Retry
					</Text>
					<Ccw color={styles.icon.colors._05} size={styles.icon.size.lg} />
				</TouchableOpacity>
			</Animated.View>
		</View>
	);
}
