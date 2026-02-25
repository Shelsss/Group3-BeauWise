import { View, Text } from 'react-native';

import { useProfilingStore } from '@/stores/useProfilingStore';
import OptionItem from './profiling/OptionItem';
export default function SingleChoiceQuestion({
	options,
	choiceLabel,
	section,
	questionIdentifier,
	selectedGender,
	questionId,
	questionCount
}) {
	const updateProfile = useProfilingStore((state) => state.setProfile);

	const currentChoice = useProfilingStore(
		(state) => state.profile[section][questionIdentifier]
	);

	const handlePress = (value) => () => {
		updateProfile(section, questionIdentifier, value);
	};

	const isSelected = (value) => {
		return currentChoice === value;
	};

	return (
		<View
			style={{
				rowGap: 8,
				marginHorizontal: 20
			}}
		>
			<Text
				style={{
					textTransform: 'uppercase',
					fontSize: 13,
					fontWeight: '800'
				}}
			>
				{choiceLabel}
			</Text>

			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',

					gap: 12,
					borderRadius: 20
				}}
			>
				{options?.map((item) => {
					return (
						<OptionItem
							key={item.id}
							item={item}
							isSelected={isSelected}
							handlePress={handlePress}
							currentSection={section}
							selectedGender={selectedGender}
							questionId={questionId}
						/>
					);
				})}
			</View>
		</View>
	);
}
