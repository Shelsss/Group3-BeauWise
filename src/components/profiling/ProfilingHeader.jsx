import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Questionnaire from '@/constants/Questionnaire';
import Colors from '@/constants/Colors';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfilingHeader({ currentStep, isTransition }) {
	const totalQuestions = Questionnaire.length;
	const { top } = useSafeAreaInsets();

	const animatedProgressStyle = useAnimatedStyle(() => ({
		width: withSpring(`${(currentStep / totalQuestions) * 100}%`, {
			damping: 20,
			stiffness: 30
		})
	}));

	const headerTitle = currentStep < 6 ? 'Skin Profiling' : 'Hair Profiling';
	return (
		currentStep > 0 &&
		!isTransition && (
			<Animated.View entering={FadeIn} style={{ paddingTop: top + 10, width: '100%' }}>
				<View style={STYLES.container}>
					<TouchableOpacity
						onPress={router.back}
						style={{
							position: 'absolute',
							bottom: 20,
							left: 2,
							paddingEnd: 30,
							paddingLeft: 10,
							paddingTop: 20,
							paddingBottom: 12,
							zIndex: 1
						}}
					>
						<ArrowLeft size={18} />
					</TouchableOpacity>
					<Text style={STYLES.headerStyle}>{headerTitle}</Text>

					<Text style={STYLES.stepStyle}>
						Step {currentStep} of {totalQuestions}
					</Text>

					<View style={STYLES.progressTrack}>
						<Animated.View style={[STYLES.progressFillWrapper, animatedProgressStyle]}>
							<View style={STYLES.progressFill} />
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
		padding: 14
	},

	headerStyle: {
		textAlign: 'center',
		color: Colors.primary,
		fontSize: 12,
		fontWeight: '700'
	},

	stepStyle: {
		textAlign: 'center',
		fontSize: 9,
		color: '#9d9a9a'
	},

	progressTrack: {
		height: 2,
		backgroundColor: '#e6e6e6',
		borderRadius: 10,
		marginTop: 12,
		width: '100%',
		overflow: 'hidden'
	},

	progressFillWrapper: {
		height: '100%',
		borderRadius: 2
	},

	progressFill: {
		backgroundColor: Colors.primary,
		flex: 1,
		borderRadius: 2
	}
});
