import { Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import LottieView from 'lottie-react-native';
import { FingerprintPattern, ShieldPlus } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Pattern from '../icons/hugeicons/Pattern';
import Hair from '../icons/hugeicons/Hair';

export default function CheckpointScreen({ section, completedSteps, totalSteps }) {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				padding: 20
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
			<View style={styles.container}>
				<Animated.Text
					entering={FadeInUp.delay(100).duration(280)}
					style={styles.checkpointTitle}
				>
					{section.checkpoint.title}
				</Animated.Text>

				<Animated.Text
					entering={FadeInUp.delay(200).duration(280)}
					style={styles.checkpointDescription}
				>
					{section.checkpoint.description}
				</Animated.Text>

				{section.checkpoint.title === 'Skin Profiling Complete!' && (
					<View style={{ rowGap: 12, marginVertical: 30 }}>
						<Animated.View
							entering={FadeInUp.delay(300).duration(280)}
							style={styles.card}
						>
							<Pattern size={18} color={Colors.primary} />

							<View>
								<Text
									style={{
										fontFamily: 'Outfit',
										fontWeight: 600,
										color: Colors.textColor,
										fontSize: 12
									}}
								>
									Hair Pattern & Texture
								</Text>
								<Text style={{ fontFamily: 'Outfit', fontSize: 10 }}>
									Determine curl type and strand thickness
								</Text>
							</View>
						</Animated.View>

						<Animated.View
							entering={FadeInUp.delay(400).duration(280)}
							style={styles.card}
						>
							<Hair size={18} color={Colors.primary} />

							<View>
								<Text
									style={{
										fontFamily: 'Outfit',
										fontWeight: 600,
										color: Colors.textColor,
										fontSize: 12
									}}
								>
									Scalp Health Assessment
								</Text>
								<Text style={{ fontFamily: 'Outfit', fontSize: 10 }}>
									Analyze oiliness and sensitivity levels
								</Text>
							</View>
						</Animated.View>
					</View>
				)}

				<Animated.Text
					entering={FadeIn.delay(500).duration(280)}
					style={{
						fontFamily: 'Outfit',
						color: Colors.textColor + '7a',
						fontSize: 12,
						marginLeft: 12,
						width: 250,
						bottom: -86,
						position: 'absolute'
					}}
				>
					<Text style={{ fontWeight: 600 }}>Reminder: </Text>All hair profiling questions
					are for general cosmetic ingredient matching and not for diagnosing scalp
					conditions like alopecia or clinical dandruff.
				</Animated.Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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
		fontFamily: 'Outfit',
		color: Colors.primary,
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 12
	},
	checkpointDescription: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: Colors.textColor + '7a',
		textAlign: 'center',
		lineHeight: 20,
		paddingHorizontal: 20
	}
});
