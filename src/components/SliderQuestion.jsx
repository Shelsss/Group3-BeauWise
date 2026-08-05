import styles from '@/config/styles';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { Text, View } from 'react-native';
import Slider from './Slider';

export default function SliderQuestion({
	activeTheme,
	options,
	choiceLabel,
	section,
	questionIdentifier
}) {
	const updateProfile = useProfilingStore((state) => state.setProfile);
	const currentChoiceValue = useProfilingStore(
		(state) => state.profile[section][questionIdentifier]
	);

	const currentChoiceRawObj = options.find((item) => item.value === currentChoiceValue);
	const currentChoiceIndex = options.indexOf(currentChoiceRawObj);

	const onValueChange = (value) => {
		const selectedValue = options[value].value;

		updateProfile(section, questionIdentifier, selectedValue);
	};

	const labels = options.map(({ label }, index) =>
		questionIdentifier === 'wash_frequency' ? index + 1 : label
	);

	return (
		<View
			style={{
				rowGap: 8,
				marginHorizontal: 20,
				marginBottom: 80
			}}
		>
			<Text
				style={{
					fontFamily: styles.font.family,
					width: '100%',
					fontSize: styles.font.size.sm,
					fontWeight: styles.font.weight.semi_bold,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				{choiceLabel}
			</Text>

			<View style={{}}>
				<Slider
					currentIndex={currentChoiceIndex}
					labels={labels}
					activeTheme={activeTheme}
					onValueChange={onValueChange}
				/>

				<View
					style={{
						marginTop: styles.spacing.three_xxl * 1.8,
						rowGap: styles.spacing.double_xl
					}}
				>
					{options.map((item, index) => (
						<View key={item.id} style={{ flexDirection: 'row' }}>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text,
									fontWeight: styles.font.weight.semi_bold
								}}
							>
								{questionIdentifier === 'wash_frequency'
									? `${index + 1}:  `
									: `${item.label}:  `}
							</Text>

							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{item.description}
							</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	);
}
