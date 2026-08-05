import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Questionnaire from '@/constants/Questionnaire';
import Colors from '@/constants/Colors';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';

export default function ProfilingHeader({
	currentStep,
	isTransition,
	setSlideDirection
}) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const totalQuestions = Questionnaire.length;
	const { top } = useSafeAreaInsets();

	const animatedProgressStyle = useAnimatedStyle(() => ({
		width: withSpring(`${(currentStep / totalQuestions) * 100}%`, {
			damping: 20,
			stiffness: 30
		})
	}));

	const headerTitle = currentStep < 5 ? 'Skin Profiling' : 'Hair Profiling';
	return (
		currentStep > 0 &&
		!isTransition && (
			<Animated.View
				entering={FadeIn}
				style={{
					paddingTop: top + 10,
					width: '100%',
					position: 'absolute',
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
			>
				<View style={STYLES.container}>
					<TouchableOpacity
						onPress={() => {
							router.back();
							setSlideDirection('backward');
						}}
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
						<ChevronLeft size={18} color={styles.theme.colors[activeTheme].icon} />
					</TouchableOpacity>
					<Text style={STYLES.headerStyle}>{headerTitle}</Text>

					<Text
						style={[
							STYLES.stepStyle,
							{ color: styles.theme.colors[activeTheme].text_secondary }
						]}
					>
						Step {currentStep} of {totalQuestions}
					</Text>

					<View
						style={[
							STYLES.progressTrack,
							{ backgroundColor: activeTheme === 'light' ? '#e6e6e6' : '#1E293B' }
						]}
					>
						<Animated.View style={[STYLES.progressFillWrapper, animatedProgressStyle]}>
							<View style={[STYLES.progressFill]} />
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
		fontFamily: styles.font.family,
		textAlign: 'center',
		color: Colors.primary,
		fontSize: 12,
		fontWeight: styles.font.weight.bold
	},

	stepStyle: {
		fontFamily: styles.font.family,
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
