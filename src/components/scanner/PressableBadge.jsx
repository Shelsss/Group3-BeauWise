import Colors from '@/constants/Colors';
import { X } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

export default function PressableBadge({ name, handlePress }) {
	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.5}
			style={{
				flexDirection: 'row',
				backgroundColor: Colors.primary,
				alignItems: 'center',
				paddingVertical: 7,
				paddingHorizontal: 14,
				columnGap: 4,
				borderRadius: 100,
				justifyContent: 'center'
			}}
		>
			<Text style={{ color: '#fff' }}>{name}</Text>
			<X size={12} color={'#fff'} />
		</TouchableOpacity>
	);
}
