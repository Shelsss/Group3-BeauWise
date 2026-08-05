import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/useThemeStore';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ name, onPress, categories }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.5}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				columnGap: 12,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderWidth: 1,
				padding: styles.spacing.xxl,
				borderRadius: styles.border.radius.size.md
			}}
		>
			<View>
				<Text
					style={{
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text,
						fontSize: styles.font.size.sm,
						fontWeight: styles.font.weight.semi_bold
					}}
				>
					{name}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<>
						<Text
							numberOfLines={1}
							ellipsizeMode='tail'
							style={{
								fontFamily: styles.font.family,
								width: 250,
								fontSize: styles.font.size.sm,
								color: styles.theme.colors[activeTheme].text_secondary,
								fontWeight: styles.font.weight.light
							}}
						>
							{categories?.join('  •  ')}
						</Text>
					</>
				</View>
			</View>

			<ChevronRight
				size={styles.icon.size.lg}
				color={styles.theme.colors[activeTheme].icon + '5a'}
				style={{ marginLeft: 'auto' }}
			/>
		</TouchableOpacity>
	);
}
