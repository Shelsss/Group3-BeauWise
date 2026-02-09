import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalSearchParams, useRouter } from 'expo-router';

import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Questionnaire from '@/constants/Questionnaire';
import { ChevronLeft, WandSparkles, ChevronRight } from 'lucide-react-native';

import { View, Text } from 'react-native';

export default function ProfilingFooter() {
	const params = useGlobalSearchParams();
	const router = useRouter();

	const step = parseInt(params.step) || 0;

	const handleNextStep = (newStep) => () => {
		if (step === Questionnaire.length) return;

		router.push(`/profiling/${newStep}`);
	};

	const handlePreviousStep = () => {
		if (step > 0) {
			router.back();
		}
	};
	const { bottom } = useSafeAreaInsets();
	return (
		<Animated.View
			style={{
				marginBottom: bottom,
				flexDirection: 'row',
				padding: 20
			}}
			entering={FadeIn}
		>
			<Animated.View
				style={{
					flex: step > 0 ? 1 : 0,
					maxWidth: step > 0 ? '50%' : 0,
					marginRight: step > 0 ? 15 : 0,
					opacity: step > 0 ? 1 : 0
				}}
			>
				<SecondaryButton handlePress={handlePreviousStep}>
					<ChevronLeft size={18} color={'#2e2d2d'} />
					<Text
						numberOfLines={1}
						style={{ color: '#2e2d2d', fontWeight: '700', fontSize: 14 }}
					>
						Previous
					</Text>
				</SecondaryButton>
			</Animated.View>

			<View style={{ flex: 1 }}>
				<PrimaryButton handlePress={handleNextStep(step + 1)}>
					<Animated.Text entering={FadeIn} style={STYLES.typography}>
						{step === 0
							? 'Get Started'
							: step === Questionnaire.length
								? 'Finish'
								: 'Next'}
					</Animated.Text>

					<Animated.View entering={FadeIn}>
						{step === Questionnaire.length ? (
							<WandSparkles style={{ marginLeft: 4 }} size={18} color={'#ffffff'} />
						) : (
							<ChevronRight size={18} color={'#ffffff'} />
						)}
					</Animated.View>
				</PrimaryButton>
			</View>
		</Animated.View>
	);
}

const STYLES = {
	typography: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 14
	}
};

// const animatedPreviousStyle = useAnimatedStyle(() => {
// 	const isVisible = step > 0;

// 	return {
// 		flex: isVisible ? 1 : 0,
// 		maxWidth: isVisible ? '50%' : 0,
// 		marginRight: isVisible ? 15 : 0,
// 		opacity: isVisible ? 1 : 0,
// 		overflow: 'hidden',
// 		width: withTiming(isVisible ? '100%' : '0%', { duration: 200 })
// 	};
// });
