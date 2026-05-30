import Colors from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

import Accordion from './Accordion';

export default function PageLayout({ item }) {
	return (
		<View
			style={{
				paddingTop: 28
			}}
		>
			<View style={{ rowGap: 8 }}>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 30,
						fontWeight: 700,
						color: Colors.primary,
						lineHeight: 36,
						textAlign: 'center'
					}}
				>
					{item?.section_title}
				</Text>
				<Text
					style={{
						fontFamily: 'Outfit',
						color: Colors.textColor + '7a',
						textAlign: 'center'
					}}
				>
					Tap a myth to reveal the scientific fact.
				</Text>
			</View>

			<View style={{ rowGap: 20, marginTop: 20 }}>
				{item?.topics.map((item, index) => (
					<Accordion hiddenContent={item.fact} key={index}>
						<Text style={STYLES.tag}>myth</Text>
						<Text style={STYLES.myth}>{item.myth}</Text>
					</Accordion>
				))}
			</View>
		</View>
	);
}

const STYLES = StyleSheet.create({
	tag: {
		fontFamily: 'Outfit',
		marginLeft: 20,
		color: '#ff7a7c',
		backgroundColor: Colors.backgroundColor,
		paddingHorizontal: 8,
		paddingVertical: 2,
		fontSize: 9,
		textTransform: 'uppercase'
	},

	myth: {
		fontFamily: 'Outfit',
		marginLeft: 12,
		marginVertical: 20,
		width: 200,
		color: Colors.textColor,
		fontSize: 12
	}
});
