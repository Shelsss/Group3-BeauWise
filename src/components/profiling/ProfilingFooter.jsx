import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useSegments } from 'expo-router';

import PrimaryButton from '@/components/PrimaryButton';
import Questionnaire from '@/constants/Questionnaire';
import { WandSparkles, ArrowRight } from 'lucide-react-native';

import { View, Text } from 'react-native';
import { useProfilingStore } from '@/stores/useProfilingStore';

export default function ProfilingFooter({
	currentStep,
	isTransition,
	numberOfCurrentQuestions,
	currentQuestions,
	currentSection
}) {
	const isInitialStepButtonActive = useProfilingStore(
		(state) => state.isInitialStepButtonActive
	);

	const router = useRouter();

	const segment = useSegments();

	const profile = useProfilingStore((state) => state.profile);

	const currentAnsweredQuestions = currentQuestions?.filter((question) => {
		const answer = profile[currentSection][question.identifier];

		return answer !== '';
	}).length;

	const disabled =
		currentStep === 0
			? isInitialStepButtonActive
			: currentAnsweredQuestions < numberOfCurrentQuestions;

	const handleNextStep = (newStep) => () => {
		if (currentStep === Questionnaire.length) {
			router.push('/profiling/summary');
			return;
		}

		if (isTransition) {
			router.push(`/profiling/${currentStep}`);
			return;
		}

		if (Questionnaire[currentStep - 1]?.showCheckPointAfter) {
			router.push(`/profiling/transition?nextStep=${newStep}`);
			return;
		}

		router.push(`/profiling/${newStep}`);
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
				<View style={{ flex: 1 }}>
					<PrimaryButton
						disabled={disabled}
						styles={{
							columnGap: 6
						}}
						handlePress={handleNextStep(currentStep + 1)}
					>
						{currentStep === 0 ? (
							<View>
								<View>
									<Text style={[{ fontSize: 16, fontWeight: 600 }, STYLES.typography]}>
										Start Profiling
									</Text>
									<Text style={[STYLES.typography, { fontWeight: 400, fontSize: 10 }]}>
										Takes about 2-3 minutes
									</Text>
								</View>
							</View>
						) : (
							<Animated.Text entering={FadeIn} style={STYLES.typography}>
								{isTransition
									? 'Continue'
									: currentStep === Questionnaire.length
										? 'Finish'
										: 'Next'}
							</Animated.Text>
						)}

						<Animated.View entering={FadeIn}>
							{currentStep === Questionnaire.length ? (
								<WandSparkles style={{ marginLeft: 4 }} size={18} color={'#ffffff'} />
							) : (
								<ArrowRight size={18} color={'#ffffff'} />
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
