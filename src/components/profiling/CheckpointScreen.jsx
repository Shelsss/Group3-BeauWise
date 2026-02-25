import { Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import LottieView from 'lottie-react-native';

export default function CheckpointScreen({ section, completedSteps, totalSteps }) {
	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
		>
			<LottieView
				style={{
					aspectRatio: 1,
					width: 200
				}}
				speed={2.5}
				autoPlay
				loop={false}
				source={require('assets/lottie/green_check.json')}
			/>
			<View style={styles.container}>
				<Text style={styles.checkpointTitle}>{section.checkpoint.title}</Text>

				<Text style={styles.checkpointDescription}>{section.checkpoint.description}</Text>

				<View style={styles.progressBadge}>
					<Text style={styles.progressText}>
						{completedSteps} of {totalSteps} sections completed
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},

	checkpointTitle: {
		fontSize: 26,
		fontWeight: '900',
		textAlign: 'center',
		marginBottom: 12
	},
	checkpointDescription: {
		fontSize: 15,
		color: '#6B7280',
		textAlign: 'center',
		lineHeight: 22,
		paddingHorizontal: 20
	},
	progressBadge: {
		marginTop: 32,
		backgroundColor: Colors.primary + '1A',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: Colors.primary + '4D'
	},
	progressText: {
		fontSize: 13,
		fontWeight: '600',
		color: Colors.primary
	}
});
