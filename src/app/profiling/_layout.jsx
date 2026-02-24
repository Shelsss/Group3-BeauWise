import ProfilingFooter from '@/components/profiling/ProfilingFooter';
import ProfilingHeader from '@/components/profiling/ProfilingHeader';
import Questionnaire from '@/constants/Questionnaire';

import { Slot, useGlobalSearchParams, useSegments } from 'expo-router';

export default function ProfilingLayout() {
	const params = useGlobalSearchParams();
	const segments = useSegments();

	const isTransition = segments.includes('transition');
	const step = parseInt(params.step);

	const currentStep = isTransition
		? parseInt(params.nextStep) || 0
		: parseInt(params.step) || 0;

	return (
		<>
			<ProfilingHeader isTransition={isTransition} currentStep={currentStep} />
			<Slot />
			<ProfilingFooter
				isTransition={isTransition}
				currentStep={currentStep}
				currentSection={Questionnaire[step - 1]?.section}
				currentQuestions={Questionnaire[step - 1]?.questions}
				numberOfCurrentQuestions={Questionnaire[step - 1]?.questions.length || 0}
			/>
		</>
	);
}
