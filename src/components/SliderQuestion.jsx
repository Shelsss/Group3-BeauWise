import Colors from '@/constants/Colors';
import { useProfilingStore } from '@/stores/useProfilingStore';
import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';

export default function SliderQuestion({
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
	const currentChoiceIndex = options.indexOf(currentChoiceRawObj) + 1 ?? 1;

	const onValueChange = (value) => {
		const selectedValue = options[value - 1].value;

		updateProfile(section, questionIdentifier, selectedValue);
	};

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
					fontFamily: 'Outfit',
					fontSize: 12,
					fontWeight: '600'
				}}
			>
				{choiceLabel}
			</Text>

			<View style={{}}>
				<Slider
					step={1}
					value={currentChoiceIndex}
					onValueChange={onValueChange}
					style={{ width: 280, position: 'absolute', transform: [{ translateX: -2 }] }}
					minimumValue={1}
					maximumValue={options.length}
					minimumTrackTintColor={Colors.primary}
					maximumTrackTintColor={Colors.primary}
					tapToSeek={true}
					thumbTintColor={Colors.primary}
				/>

				<View
					style={{
						flexDirection: 'row',
						columnGap: options.length < 5 ? 40 : 34,
						position: 'absolute',
						transform: [{ translateX: -3 }, { translateY: 20 }]
					}}
				>
					{options.map((item) => (
						<View key={item.id}>
							<Text
								style={{
									textAlign: 'center',
									width: options.length < 5 ? 40 : 30,
									fontFamily: 'Outfit',
									fontSize: 10
								}}
							>
								{item.label}
							</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	);
}
