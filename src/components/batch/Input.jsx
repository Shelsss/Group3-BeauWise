import { CircleQuestionMark } from 'lucide-react-native';
import { TextInput, View } from 'react-native';
import { useState } from 'react';
import Colors from '@/constants/Colors';

export default function BatchInput( {onCodeValueChanged} ) {
	const [value, setValue] = useState('');

	const handleChange = (value) => {
		setValue(value);
        onCodeValueChanged(value);
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: Colors.primary + '1a',
				borderWidth: 1,
				borderColor: Colors.primary + '4a',
				paddingVertical: 2,
				paddingHorizontal: 16,
				borderRadius: 16,
				marginTop: 8
			}}
		>
			<TextInput
				value={value}
				placeholder='Enter Batch Code'
				style={{
					fontSize: 16,
					flex: 1,
					color: Colors.textColor
				}}
				onChangeText={handleChange}
				placeholderTextColor={Colors.textColor + '7a'}
				cursorColor={'#303030'}
			/>

			<CircleQuestionMark size={16} color={Colors.textColor + '7a'} />
		</View>
	);
}
