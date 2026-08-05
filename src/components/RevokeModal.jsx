import styles from '@/config/styles';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { X } from 'lucide-react-native';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Info from './icons/hugeicons/Info';

export function RevokeModal() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const revokeVisible = useAuthStore((state) => state.revokeVisible);
	const setRevokeVisible = useAuthStore((state) => state.setRevokeVisible);

	return (
		<>
			<Portal>
				<Modal visible={revokeVisible} style={{ padding: styles.spacing.double_xl }}>
					<View
						style={{
							alignItems: 'center',
							rowGap: styles.spacing.md,
							padding: styles.spacing.one_xxl,
							alignSelf: 'center',
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<Info color={styles.theme.colors.primary} size={styles.icon.size.xl * 2.4} />
						<Text
							style={{
								textAlign: 'center',
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Your access has been revoked across all devices.
						</Text>
					</View>

					<TouchableOpacity
						onPress={() => setRevokeVisible(false)}
						activeOpacity={0.7}
						style={{
							position: 'absolute',
							bottom: -50,
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.pill,
							alignSelf: 'center',
							flexDirection: 'row',
							padding: styles.spacing.lg
						}}
					>
						<X size={styles.icon.size.xl} />
					</TouchableOpacity>
				</Modal>
			</Portal>
		</>
	);
}
