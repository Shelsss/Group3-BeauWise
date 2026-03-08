import Colors from '@/constants/Colors';
import { Funnel } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function SearchFilter({ label = 'Filter', handlePress, style }) {
	return (
		<Pressable onPress={handlePress} style={style} android_disableSound={true}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',

					borderRadius: 100,

					paddingHorizontal: 10,
					paddingVertical: 10,
					backgroundColor: Colors.primary + '2a',

					columnGap: 6
				}}
			>
				<Funnel size={15} color={Colors.primary} />
			</View>
		</Pressable>
	);
}
