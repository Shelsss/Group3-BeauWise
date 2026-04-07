import { View, Text } from 'react-native';

export default function Disclaimer({ content, color, disclaimerTitle, children }) {
	return (
		<View
			style={{
				borderRadius: 24,
				backgroundColor: color + '2a',
				flex: 1,
				flexDirection: 'row',
				columnGap: 12,
				padding: 16,
				overflow: 'hidden'
			}}
		>
			{children}
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontWeight: 600,
						fontSize: 14,
						lineHeight: 20,
						color: '#334155'
					}}
				>
					{disclaimerTitle}
				</Text>

				<Text
					style={{
						lineHeight: 18,
						fontSize: 12,
						display: 'flex',
						flexWrap: 'wrap',
						color: '#334155'
					}}
				>
					{content}
				</Text>
			</View>
		</View>
	);
}
