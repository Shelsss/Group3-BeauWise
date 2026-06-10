import Colors from '@/constants/Colors';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

export default function BatchSelect({ handleSelect }) {
	return (
		<Pressable
			onPress={handleSelect}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: Colors.primary + '1a',
				borderWidth: 1,
				borderColor: Colors.primary + '4a',
				paddingVertical: 14,
				paddingHorizontal: 16,
				borderRadius: 16,
				marginTop: 8
			}}
		>
			<Text
				style={{
					fontFamily: 'Outfit',
					fontSize: 16,
					marginRight: 'auto',
					color: Colors.textColor + '7a'
				}}
			>
				Select Brand
			</Text>
			<ChevronDown size={18} color={Colors.textColor + '7a'} />
		</Pressable>
	);
}
