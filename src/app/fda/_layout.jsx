import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function BatchLayout() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}
			}}
		/>
	);
}
