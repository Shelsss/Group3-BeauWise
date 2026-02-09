import { View } from 'react-native';

import InitialStep from '@/components/profiling/InitialStep';
import Questions from '@/components/profiling/Questions';

import Questionnaire from '@/constants/Questionnaire';
import { useLocalSearchParams } from 'expo-router';

export default function ProfilingScreen() {
	const localParams = useLocalSearchParams();

	const step = parseInt(localParams.step) || 0;

	return (
		<View style={{ flex: 1 }}>
			{step === 0 ? (
				<InitialStep />
			) : (
				<Questions
					profilingType={Questionnaire[step - 1]}
					questions={Questionnaire[step - 1].questions}
					step={step}
				/>
			)}
		</View>
	);
}
