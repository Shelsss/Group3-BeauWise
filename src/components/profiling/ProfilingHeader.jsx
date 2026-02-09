import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Questionnaire from '@/constants/Questionnaire';

export default function ProfilingHeader() {
	const params = useGlobalSearchParams();
	const totalQuestions = Questionnaire.length;
	const { top } = useSafeAreaInsets();

	const currentStep = parseInt(params.step) || 0;
	const animatedProgressStyle = useAnimatedStyle(() => ({
		width: withSpring(`${(currentStep / totalQuestions) * 100}%`, {
			damping: 20,
			stiffness: 30
		})
	}));

	return (
		currentStep > 0 && (
			<Animated.View entering={FadeIn} style={{ paddingTop: top, width: '100%' }}>
				<View style={STYLES.container}>
					<Text style={STYLES.headerStyle}>{Questionnaire[currentStep - 1]?.title}</Text>

					<Text style={STYLES.stepStyle}>
						Step {currentStep} of {totalQuestions}
					</Text>

					<View style={STYLES.progressTrack}>
						<Animated.View style={[STYLES.progressFillWrapper, animatedProgressStyle]}>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								colors={['#b8a4f5', '#ffb9ca']}
								style={STYLES.progressFill}
							/>
						</Animated.View>
					</View>
				</View>
			</Animated.View>
		)
	);
}

const STYLES = StyleSheet.create({
	container: {
		display: 'flex',
		alignItems: 'center',
		padding: 14
	},

	headerStyle: {
		fontSize: 12,
		fontWeight: '700'
	},

	stepStyle: {
		fontSize: 9,
		color: '#9d9a9a'
	},

	progressTrack: {
		height: 4,
		backgroundColor: '#e6e6e6',
		borderRadius: 2,
		marginTop: 12,
		width: '100%',
		overflow: 'hidden'
	},

	progressFillWrapper: {
		height: '100%',
		borderRadius: 2
	},

	progressFill: {
		flex: 1,
		borderRadius: 2
	}
});
