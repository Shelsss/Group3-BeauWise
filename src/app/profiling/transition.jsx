import { useLocalSearchParams } from 'expo-router';

import CheckpointScreen from '@/components/profiling/CheckpointScreen';
import Questionnaire from '@/constants/Questionnaire';

export default function ProfilingTransition() {
	const { nextStep } = useLocalSearchParams();
	const nextStepIndex = parseInt(nextStep) - 1;
	const previousSection = Questionnaire[nextStepIndex - 1];

	return (
		<CheckpointScreen
			section={previousSection}
			completedSteps={parseInt(nextStep) - 1}
			totalSteps={Questionnaire.length}
		/>
	);
}
