import { ArrowRight, Lightbulb } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function Card({ title, description, buttonLabel, tag, routeTarget }) {
	return (
		<Shadow distance={1} stretch={true} startColor='#00000010' offset={[0, 1]}>
			<View style={STYLES.cardContainer}>
				<View style={STYLES.firstColumnContainer}>
					<Text style={STYLES.tag}>{tag}</Text>

					<Text style={STYLES.cardTitle}>{title}</Text>

					<Text style={STYLES.cardDescription}>{description}</Text>

					<TouchableOpacity
						onPress={() => {
							router.push(`/learn/[${routeTarget}]`);
						}}
						activeOpacity={0.8}
						style={STYLES.button}
					>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontSize: 12,
								color: Colors.backgroundColor,

								textTransform: 'capitalize'
							}}
						>
							{buttonLabel}
						</Text>
						<ArrowRight size={14} color={'#fff'} />
					</TouchableOpacity>
				</View>

				<View
					style={{
						borderRadius: 8,
						marginLeft: 'auto',
						backgroundColor: Colors.secondary + '3a',
						padding: 30,
						alignSelf: 'flex-start'
					}}
				>
					<Lightbulb size={28} color={Colors.secondary + '9a'} />
				</View>
			</View>
		</Shadow>
	);
}

const STYLES = StyleSheet.create({
	tag: {
		fontFamily: 'Outfit',
		textTransform: 'uppercase',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 4,
		backgroundColor: Colors.secondary + '3a',
		color: Colors.textColor,
		fontWeight: 500,
		fontSize: 9,
		letterSpacing: 0.5
	},

	firstColumnContainer: {
		rowGap: 10,
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},

	cardContainer: {
		borderRadius: 16,
		backgroundColor: Colors.backgroundColor,
		padding: 16,
		flexDirection: 'row'
	},

	cardTitle: {
		fontFamily: 'Outfit',
		width: 120,
		color: Colors.textColor,
		fontWeight: 700,
		fontSize: 18
	},

	cardDescription: {
		fontFamily: 'Outfit',
		width: 200,

		fontSize: 14,
		lineHeight: 20,
		color: Colors.textColor + '7a'
	},

	button: {
		columnGap: 8,
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: Colors.primary,
		flexDirection: 'row'
	}
});
