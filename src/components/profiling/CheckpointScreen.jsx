import { Text, StyleSheet, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import LottieView from 'lottie-react-native';
import { FingerprintPattern, ShieldPlus } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Pattern from '../icons/hugeicons/Pattern';
import Hair from '../icons/hugeicons/Hair';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';

export default function CheckpointScreen({ section, completedSteps, totalSteps }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				padding: 20,
				paddingBottom: 180
			}}
		>
			<LottieView
				style={{
					aspectRatio: 1,
					width: 180
				}}
				autoPlay
				loop={false}
				source={require('assets/lottie/check-animation.json')}
			/>
			<View style={STYLES.container}>
				<Animated.Text
					entering={FadeInUp.delay(100).duration(280)}
					style={STYLES.checkpointTitle}
				>
					{section.checkpoint.title}
				</Animated.Text>

				<Animated.Text
					entering={FadeInUp.delay(200).duration(280)}
					style={[
						STYLES.checkpointDescription,
						{ color: styles.theme.colors[activeTheme].text }
					]}
				>
					{section.checkpoint.description}
				</Animated.Text>

				{section.checkpoint.title === 'Skin Profiling Complete!' && (
					<View style={{ rowGap: 12, marginVertical: 30 }}>
						<Animated.View
							entering={FadeInUp.delay(300).duration(280)}
							style={[
								STYLES.card,
								{
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].card_border,
									borderRadius: styles.border.radius.size.md
								}
							]}
						>
							<Pattern size={18} color={styles.theme.colors.primary} />

							<View>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontWeight: styles.font.weight.bold,
										color: styles.theme.colors[activeTheme].text,
										fontSize: styles.font.size.sm
									}}
								>
									Hair Pattern & Texture
								</Text>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].text,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									Determine curl type and strand thickness
								</Text>
							</View>
						</Animated.View>

						<Animated.View
							entering={FadeInUp.delay(400).duration(280)}
							style={[
								STYLES.card,
								{
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].card_border,
									borderRadius: styles.border.radius.size.md
								}
							]}
						>
							<Hair size={18} color={styles.theme.colors.primary} />

							<View>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontWeight: styles.font.weight.bold,
										color: styles.theme.colors[activeTheme].text,
										fontSize: styles.font.size.sm
									}}
								>
									Scalp Health Assessment
								</Text>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].text,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									Analyze oiliness and sensitivity levels
								</Text>
							</View>
						</Animated.View>
					</View>
				)}

				<Animated.Text
					entering={FadeIn.delay(500).duration(280)}
					style={{
						lineHeight: styles.spacing.one_xxl,
						fontFamily: styles.font.family,
						fontSize: styles.font.size.md,
						marginLeft: 12,
						width: 250,
						bottom: -120,
						position: 'absolute',
						color: styles.theme.colors[activeTheme].text
					}}
				>
					<Text style={{ fontWeight: 600, color: styles.theme.colors[activeTheme].text }}>
						Reminder:{' '}
					</Text>
					All hair profiling questions are for general cosmetic ingredient matching and
					not for diagnosing scalp conditions like alopecia or clinical dandruff.
				</Animated.Text>
			</View>
		</View>
	);
}

const STYLES = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginBottom: 40
	},

	card: {
		flexDirection: 'row',
		columnGap: 12,
		borderRadius: 18,
		paddingVertical: 12,
		paddingHorizontal: 14,
		backgroundColor: Colors.backgroundColor,
		alignItems: 'center',
		shadowColor: '#00000027',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	},

	checkpointTitle: {
		fontFamily: styles.font.family,
		color: styles.theme.colors.primary,
		fontSize: styles.font.size.lg,
		fontWeight: styles.font.weight.semi_bold,
		textAlign: 'center',
		marginBottom: 12
	},
	checkpointDescription: {
		fontFamily: styles.font.family,
		fontSize: styles.font.size.md,

		textAlign: 'center',
		lineHeight: 20,
		paddingHorizontal: 20
	}
});
