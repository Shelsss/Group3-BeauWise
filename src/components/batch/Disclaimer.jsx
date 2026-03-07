import { View, Text } from 'react-native';
import Info from '../icons/Info';
import Colors from '@/constants/Colors';

export default function Disclaimer({ note, color }) {
	return (
		<View
			style={{
				borderRadius: 24,
				backgroundColor: color + '1a',
				flex: 1,
				flexDirection: 'row',
				columnGap: 12,
				padding: 16,
				overflow: 'hidden'
			}}
		>
			<Info size={20} color={color} />

			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontWeight: 600,
						fontSize: 14,
						lineHeight: 20,
						color: Colors.textColor
					}}
				>
					{note.title}
				</Text>

				<Text
					style={{
						fontSize: 12,
						display: 'flex',
						flexWrap: 'wrap',
						color: Colors.textColor
					}}
				>
					{note.message}
				</Text>
			</View>
		</View>
	);
}
