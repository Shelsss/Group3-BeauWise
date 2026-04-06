import { Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import LottieView from 'lottie-react-native';
import { FingerprintPattern, ShieldPlus } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function CheckpointScreen({ section, completedSteps, totalSteps }) {
	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
		>
			<LottieView
				style={{
					marginTop: 30,
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
							<View
								style={{ backgroundColor: '#7676760b', padding: 12, borderRadius: 30 }}
							>
								<FingerprintPattern size={18} color={Colors.primary} />
							</View>
							<View>
								<Text style={{ fontWeight: 700, color: Colors.textColor }}>
									Hair Pattern & Texture
								</Text>
								<Text>Determine curl type and strand thickness</Text>
							</View>
						</Animated.View>

						<Animated.View
							entering={FadeInUp.delay(400).duration(280)}
							style={styles.card}
						>
							<View
								style={{ backgroundColor: '#5959590b', padding: 12, borderRadius: 30 }}
							>
								<ShieldPlus size={18} color={Colors.primary} />
							</View>
							<View>
								<Text style={{ fontWeight: 700, color: Colors.textColor }}>
									Scalp Health Assessment
								</Text>
								<Text>Analyze oiliness and sensitivity levels</Text>
							</View>
						</Animated.View>
					</View>
				)}

				<Animated.Text
					entering={FadeIn.delay(500).duration(280)}
					style={{ color: Colors.textColor + '7a' }}
				>
					<Text style={{ fontWeight: 700 }}>Reminder: </Text>All hair profiling questions
					are for general cosmetic ingredient matching and not for diagnosing scalp
					conditions like alopecia or clinical dandruff.
				</Animated.Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},

	card: {
		flexDirection: 'row',
		columnGap: 12,
		borderRadius: 16,
		padding: 16,
		backgroundColor: Colors.backgroundColor,

		shadowColor: '#00000053',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	},

	checkpointTitle: {
		color: Colors.primary,
		fontSize: 26,
		fontWeight: '900',
		textAlign: 'center',
		marginBottom: 12
	},
	checkpointDescription: {
		fontSize: 15,
		color: Colors.textColor + '7a',
		textAlign: 'center',
		lineHeight: 22,
		paddingHorizontal: 20
	}
});
