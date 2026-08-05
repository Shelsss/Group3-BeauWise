import { Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import styles from '@/config/styles';
export default function CreateAccountButton() {
	return (
		<TouchableOpacity
			onPress={() => router.push('authentication/sign-up')}
			activeOpacity={0.7}
			style={{
				marginTop: 6,
				paddingVertical: 14,
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: styles.theme.colors.primary,
				padding: 16,
				borderRadius: styles.border.radius.size.sm
			}}
		>
			<View>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.bold,
						color: Colors.backgroundColor
					}}
				>
					Create Your Account
				</Text>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						color: Colors.backgroundColor,
						marginLeft: 'auto'
					}}
				>
					Start tracking your beauty journey
				</Text>
			</View>

			<ArrowRight
				style={{ marginLeft: 'auto' }}
				color={styles.background_color._04}
				size={styles.icon.size.xl}
			/>
		</TouchableOpacity>
	);
}
