import { View, Text } from 'react-native';
import Info from '@/components/icons/Info';

export default function Disclaimer({ description }) {
	return (
		<View
			style={{
				borderRadius: 24,
				backgroundColor: '#20C9972a',
				flex: 1,
				flexDirection: 'row',
				columnGap: 12,
				padding: 16,
				overflow: 'hidden'
			}}
		>
			<Info size={20} color='#20C997' />
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontWeight: 600,
						fontSize: 14,
						lineHeight: 20,
						color: '#334155'
					}}
				>
					Disclaimer
				</Text>

				<Text
					style={{
						fontSize: 12,
						display: 'flex',
						flexWrap: 'wrap',
						color: '#334155'
					}}
				>
					{description}
				</Text>
			</View>
		</View>
	);
}
