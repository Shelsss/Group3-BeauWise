import { View, Text } from 'react-native';

import { useProfilingStore } from '@/stores/useProfilingStore';

import OptionItem from './profiling/OptionItem';

export default function MultiCheckBoxContainer({
	options,
	choiceLabel,
	section,
	questionIdentifier
}) {
	const updateProfile = useProfilingStore((state) => state.setProfile);
	const currentChoice = useProfilingStore(
		(state) => state.profile[section][questionIdentifier]
	);

	const handlePress = (value) => () => {
		updateProfile(section, questionIdentifier, value);
	};

	const isSelected = (value) => {
		return currentChoice.includes(value);
	};

	return (
		<View style={{ marginHorizontal: 20 }}>
			<Text
				style={{
					textTransform: 'uppercase',
					width: '100%',
					fontSize: 14,
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
							section={section}
						/>
					);
				})}
			</View>
		</View>
	);
}
