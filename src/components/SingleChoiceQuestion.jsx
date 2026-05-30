import { View, Text } from 'react-native';

import { useProfilingStore } from '@/stores/useProfilingStore';
import OptionItem from './profiling/OptionItem';

export default function SingleChoiceQuestion({
	options,
	choiceLabel,
	section,
	questionIdentifier,

	questionId
}) {
	const profoo = useProfilingStore((state) => state.profile);

	console.log(profoo);

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
					fontFamily: 'Outfit',
					fontSize: 12,
					fontWeight: '600'
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
							questionId={questionId}
						/>
					);
				})}
			</View>
		</View>
	);
}
