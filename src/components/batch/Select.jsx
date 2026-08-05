import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { createAnimatedComponent } from 'react-native-reanimated';

const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);

export default function BatchSelect({
	handleSelect,
	brandText,
	activeTheme,
	error = undefined
}) {
	return (
		<View style={{ rowGap: styles.spacing.sm }}>
			<Text
				style={{
					fontFamily: styles.font.family,
					fontSize: styles.font.size.sm,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				Select Brand
			</Text>

			<AnimatedTouchableOpacity
				activeOpacity={0.7}
				onPress={handleSelect}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: styles.theme.colors[activeTheme].input_background,
					borderWidth: 1,
					borderColor: error
						? styles.theme.colors.status.red
						: styles.theme.colors[activeTheme].input_border,
					paddingVertical: 14,
					paddingHorizontal: 16,
					borderRadius: styles.border.radius.size.sm,
					transitionDuration: 300
				}}
			>
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md,
						marginRight: 'auto',
						color: brandText
							? styles.theme.colors.batch
							: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					{brandText ? brandText : 'e.g., Sunsilk, CeraVe'}
				</Text>
				<ChevronDown size={18} color={styles.theme.colors[activeTheme].icon + '7a'} />
			</AnimatedTouchableOpacity>
		</View>
	);
}
