import { Search, X } from 'lucide-react-native';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';

export default function SearchBar({
	handleQuery,
	style,
	placeholder = 'Search...',
	closeQueryResults = null
}) {
	const [value, setValue] = useState('');

	const handleChange = (text) => {
		if (text.length === 0 && closeQueryResults) {
			closeQueryResults();
		}

		handleQuery(text).call();
		setValue(text);
	};

	const clearInput = () => {
		setValue('');
		handleQuery('').call();

		if (closeQueryResults) {
			closeQueryResults();
		}
	};

	return (
		<View style={[STYLES.container, style]}>
			<Search size={15} color={'#9a9a9a'} />

			<TextInput
				value={value}
				placeholder={placeholder}
				style={{ flex: 1, color: '#181818', fontFamily: 'Outfit' }}
				onChangeText={handleChange}
				placeholderTextColor={'#9a9a9a'}
				onSubmitEditing={({ nativeEvent: { text } }) => handleQuery(text).call()}
				cursorColor={'#303030'}
			/>

			{value.length > 0 && (
				<Pressable onPress={clearInput}>
					<X size={18} />
				</Pressable>
			)}
		</View>
	);
}

const STYLES = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#d0d0d02a',
		borderRadius: 100,
		columnGap: 2,
		paddingHorizontal: 15
	}
});
