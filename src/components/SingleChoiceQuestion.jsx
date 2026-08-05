import { View, Text } from 'react-native';

import { useProfilingStore } from '@/stores/useProfilingStore';
import OptionItem from './profiling/OptionItem';
import styles from '@/config/styles';

export default function SingleChoiceQuestion({
	options,
	choiceLabel,
	section,
	questionIdentifier,
	activeTheme,
	questionId
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
					fontFamily: styles.font.family,
					fontSize: styles.font.size.md,
					fontWeight: styles.font.weight.semi_bold,
					color: styles.theme.colors[activeTheme].text
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
							activeTheme={activeTheme}
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
