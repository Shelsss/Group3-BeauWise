import Colors from '@/constants/Colors';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { Pencil } from 'lucide-react-native';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import React from 'react';

export default function SummaryCard({
	handlePresentModalPress,
	section,
	label,
	sectionValue,
	iconProp,
	iconColor
}) {
	return (
		<View style={STYLES.cardStyle}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',

					alignItems: 'center'
				}}
			>
				<View style={[STYLES.iconStyle, { backgroundColor: iconColor + '40' }]}>
					{iconProp}
				</View>

				<Text style={{ fontSize: 16, fontWeight: '700' }}>{label}</Text>

				<Pressable
					style={{
						marginLeft: 'auto',
						marginRight: 8,

						paddingHorizontal: 8,
						paddingVertical: 10,
						borderRadius: 6
					}}
					onPress={handlePresentModalPress(section)}
				>
					<Pencil size={20} color={'#2a2a2aee'} />
				</Pressable>
			</View>

			<View
				style={{
					display: 'flex',
					flexDirection: label === 'About You' ? 'row' : 'column',

					marginTop: 20,
					[section === 'about_you' ? 'columnGap' : 'rowGap']: 18,
					alignItems: 'flex-start'
				}}
			>
				{sectionValue.map(([questionTitle, selectedValue]) => (
					<View
						style={{ width: section !== 'about_you' ? '100%' : 'auto' }}
						key={questionTitle}
					>
						{section !== 'about_you' && (
							<Text
								style={{
									fontSize: 12,
									fontWeight: '500',
									color: '#676767f0',
									marginBottom: 4
								}}
							>
								{formatSnakeToTitle(questionTitle)}
							</Text>
						)}
						<View
							style={[
								STYLES.chipStyle,
								{
									backgroundColor: iconColor + '1A'
								}
							]}
						>
							{Array.isArray(selectedValue) ? (
								selectedValue.map((subItem) => (
									<Text style={STYLES.textStyle} key={subItem}>
										{formatSnakeToTitle(subItem)}
									</Text>
								))
							) : (
								<Text style={STYLES.textStyle}>{formatSnakeToTitle(selectedValue)}</Text>
							)}
						</View>
					</View>
				))}
			</View>
		</View>
	);
}

const STYLES = StyleSheet.create({
	cardStyle: {
		padding: 16,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: 'rgba(46, 45, 46, 0)',
		backgroundColor: '#ffffff',
		shadowColor: '#0000009f',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.15,
		shadowRadius: 1.0,
		elevation: 1,
		width: '100%'
	},

	iconStyle: {
		backgroundColor: Colors.primary + '40',
		padding: 10,
		borderRadius: 100,
		borderColor: Colors.primary + '4D',
		marginRight: 12
	},

	chipStyle: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20
	},

	textStyle: {
		fontSize: 12,
		fontWeight: '500',
		letterSpacing: 0.2
	}
});
