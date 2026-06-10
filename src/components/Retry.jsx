import Colors from '@/constants/Colors';
import { Text, TouchableOpacity, View } from 'react-native';
import Dizzy from '@/components/icons/hugeicons/Dizzy';

export default function Retry({
	refetch,
	title = 'We had trouble loading this page.',
	subTitle = 'Give it another shot?'
}) {
	return (
		<View
			style={{
				alignItems: 'center',
				rowGap: 8
			}}
		>
			<Dizzy size={70} color='#334155' />

			<View>
				<Text
					style={{
						fontSize: 16,
						fontFamily: 'Outfit',
						fontWeight: 600,
						color: Colors.textColor
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						textAlign: 'center',
						color: Colors.textColor,
						fontFamily: 'Outfit'
					}}
				>
					{subTitle}
				</Text>
			</View>

			<TouchableOpacity
				onPress={refetch}
				style={{
					marginTop: 4,
					backgroundColor: Colors.primary,
					borderRadius: 50,
					paddingVertical: 12,
					paddingHorizontal: 28
				}}
			>
				<Text style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 500 }}>
					Try Again
				</Text>
			</TouchableOpacity>
		</View>
	);
}
