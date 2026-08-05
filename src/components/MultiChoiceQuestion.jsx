import { View, Text } from 'react-native';

import { useProfilingStore } from '@/stores/useProfilingStore';

import OptionItem from './profiling/OptionItem';
import styles from '@/config/styles';

export default function MultiCheckBoxContainer({
	activeTheme,
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
		<View style={{ marginHorizontal: 20, rowGap: 8 }}>
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
							section={section}
						/>
					);
				})}
			</View>
		</View>
	);
}
