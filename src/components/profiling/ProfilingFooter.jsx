import Animated, {
	FadeIn,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	useGlobalSearchParams,
	useLocalSearchParams,
	useRouter,
	useSegments
} from 'expo-router';

import PrimaryButton from '@/components/PrimaryButton';
import Questionnaire from '@/constants/Questionnaire';
import { WandSparkles, ArrowRight } from 'lucide-react-native';

import { View, Text, BackHandler } from 'react-native';
import { useProfilingStore } from '@/stores/useProfilingStore';
import styles from '@/config/styles';
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function ProfilingFooter({
	currentStep,
	isTransition,
	numberOfCurrentQuestions,
	currentQuestions,
	currentSection,
	showModal
}) {
	const isInitialStepButtonActive = useProfilingStore(
		(state) => state.isInitialStepButtonActive
	);
	const params = useGlobalSearchParams();
	const isEdit = JSON.parse(params?.fromSummary ?? false);

	const setSlideDirection = useProfilingStore((state) => state.setSlideDirection);

	const router = useRouter();

	const segment = useSegments();

	const profile = useProfilingStore((state) => state.profile);

	const debounceShowModal = useDebouncedCallback(showModal, 400);

	const currentAnsweredQuestions = currentQuestions?.filter((question) => {
		const answer = profile[currentSection][question.identifier];

		let status;

		if (Array.isArray(answer)) {
			status = answer.length > 0;
		} else {
			status = answer !== '';
		}
		return status;
	}).length;

	const disabled =
		currentStep === 0
			? isInitialStepButtonActive
			: currentAnsweredQuestions < numberOfCurrentQuestions;

	const handleNextStep = (newStep) => () => {
		if (isEdit) {
			router.back();
			return;
		}

		if (newStep === 1) {
			debounceShowModal();
		}

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
		setSlideDirection('forward');
	};

	const { bottom } = useSafeAreaInsets();

	return (
		!segment.includes('summary') && (
			<Animated.View
				layout={LinearTransition.springify().damping(120)}
				style={[
					{
						marginTop: 'auto',
						marginBottom: bottom,
						flexDirection: 'row',
						padding: 20,
						position: 'absolute',
						bottom: 0
					}
				]}
				entering={FadeIn}
			>
				<View style={{ flex: 1 }}>
					{!disabled && (
						<PrimaryButton
							disabled={disabled}
							styles={{
								columnGap: 6,
								borderRadius: styles.border.radius.size.sm
							}}
							handlePress={handleNextStep(currentStep + 1)}
						>
							{currentStep === 0 ? (
								<Animated.Text entering={FadeIn} style={[STYLES.typography]}>
									Start Profiling
								</Animated.Text>
							) : (
								<Animated.Text entering={FadeIn} style={STYLES.typography}>
									{isTransition ? 'Continue' : isEdit ? 'Save' : 'Next'}
								</Animated.Text>
							)}
						</PrimaryButton>
					)}
				</View>
			</Animated.View>
		)
	);
}

const STYLES = {
	typography: {
		fontFamily: styles.font.family,
		color: styles.font.colors._04,
		fontWeight: styles.font.weight.bold,
		fontSize: styles.font.size.md,
		textAlign: 'center'
	}
};
