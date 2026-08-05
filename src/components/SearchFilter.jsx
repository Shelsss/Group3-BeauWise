import Colors from '@/constants/Colors';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Filter from '@/components/icons/hugeicons/Filter';

export default function SearchFilter({ label = 'Filter', handlePress, style }) {
	return (
		<TouchableOpacity onPress={handlePress} style={style}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',

					borderRadius: 100,

					paddingHorizontal: 10,
					paddingVertical: 10,

					columnGap: 6
				}}
			>
				<Filter size={20} color={Colors.primary} />
			</View>
		</TouchableOpacity>
	);
}
