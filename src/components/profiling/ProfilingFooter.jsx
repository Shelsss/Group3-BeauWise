import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useSegments } from 'expo-router';

import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Questionnaire from '@/constants/Questionnaire';
import { ChevronLeft, WandSparkles, ChevronRight } from 'lucide-react-native';

import { View, Text } from 'react-native';
import { useProfilingStore } from '@/stores/useProfilingStore';

export default function ProfilingFooter({
	currentStep,
	isTransition,
	numberOfCurrentQuestions,
	currentQuestions,
	currentSection
}) {
	const router = useRouter();

	const previousButtonVisible = currentStep > 0;
	const segment = useSegments();

	const profile = useProfilingStore((state) => state.profile);

	const currentAnsweredQuestions = currentQuestions?.filter((question) => {
		const answer = profile[currentSection][question.identifier];

		return answer !== '';
	}).length;

	const handleNextStep = (newStep) => () => {
		if (isTransition) {
			if (currentStep > Questionnaire.length) {
				router.push('/profiling/summary');
				return;
			}
			router.push(`/profiling/${currentStep}`);
			return;
		}

		if (Questionnaire[currentStep - 1]?.showCheckPointAfter) {
			router.push(`/profiling/transition?nextStep=${newStep}`);
			return;
		}

		router.push(`/profiling/${newStep}`);
	};

	const handlePreviousStep = () => {
		if (currentStep > 0) {
			router.back();
		}
	};
	const { bottom } = useSafeAreaInsets();
	return (
		!segment.includes('summary') && (
			<Animated.View
				style={{
					marginTop: 'auto',
					marginBottom: bottom,
					flexDirection: 'row',
					padding: 20
				}}
				entering={FadeIn}
			>
				<Animated.View
					style={{
						flex: previousButtonVisible ? 1 : 0,
						maxWidth: previousButtonVisible ? '50%' : 0,
						marginRight: previousButtonVisible ? 15 : 0,
						opacity: previousButtonVisible ? 1 : 0,
						transitionDuration: 250
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
					<PrimaryButton
						disabled={currentAnsweredQuestions < numberOfCurrentQuestions}
						handlePress={handleNextStep(currentStep + 1)}
					>
						<Animated.Text entering={FadeIn} style={STYLES.typography}>
							{currentStep === 0
								? 'Get Started'
								: isTransition
									? 'Continue'
									: currentStep === Questionnaire.length
										? 'Finish'
										: 'Next'}
						</Animated.Text>

						<Animated.View entering={FadeIn}>
							{currentStep === Questionnaire.length ? (
								<WandSparkles style={{ marginLeft: 4 }} size={18} color={'#ffffff'} />
							) : (
								<ChevronRight size={18} color={'#ffffff'} />
							)}
						</Animated.View>
					</PrimaryButton>
				</View>
			</Animated.View>
		)
	);
}

const STYLES = {
	typography: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 14
	}
};
