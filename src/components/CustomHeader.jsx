import Colors from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import SingleSidedShadow from './SingleSidedShadow';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from '@/config/styles';

export default function CustomHeader({ title, children }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return (
		<View
			style={[
				{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: 15,
					paddingTop: 70,
					paddingBottom:
						title === 'History' && !isAuthenticated
							? styles.spacing.double_xxl
							: title === 'Learn'
								? styles.spacing.three_xxl + 24
								: styles.spacing.double_xxl
				}
			]}
		>
			<Animated.Text
				style={{
					position: title === 'Learn' ? 'absolute' : 'relative',
					left: title === 'Learn' ? 15 : 'auto',
					top: title === 'Learn' ? 56 : 'auto',
					fontFamily: styles.font.family,
					fontSize: styles.font.size.one_xl,
					fontWeight: styles.font.weight.bold,
					color: styles.font.colors._04
				}}
			>
				{title === 'Home' ? 'BeauWise' : title}
			</Animated.Text>

			{title === 'Learn' && (
				<Text
					style={{
						left: 15,
						bottom: styles.spacing.double_xxl,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.sm,
						fontWeight: styles.font.weight.light,
						color: styles.font.colors._04,
						position: 'absolute'
					}}
				>
					Understand Cosmetic Products
				</Text>
			)}

			{children}
		</View>
	);
}
