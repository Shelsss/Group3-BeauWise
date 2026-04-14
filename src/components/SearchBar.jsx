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
		setValue(text);
		handleQuery(text); // ✅ send value to parent
	};

	const clearInput = () => {
		setValue('');
		handleQuery(''); // ✅ clear parent query
	};

	return (
		<View style={[STYLES.container, style]}>
			<Search size={15} color={'#9a9a9a'} />

			<TextInput
				value={value}
				placeholder={placeholder}
				style={{ flex: 1, color: '#181818' }}
				onChangeText={handleChange} // ✅ correct
				placeholderTextColor={'#9a9a9a'}
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