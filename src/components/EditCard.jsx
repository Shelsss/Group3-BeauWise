import Colors from '@/constants/Colors';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import { memo } from 'react';
import Edit2 from '@/components/icons/hugeicons/Edit2';

function EditCard({
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
				<View style={[STYLES.iconStyle]}>{iconProp}</View>

				<Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Outfit' }}>
					{label}
				</Text>

				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						marginLeft: 'auto',
						marginRight: 8,

						paddingHorizontal: 8,
						paddingVertical: 10,
						borderRadius: 6
					}}
					onPress={handlePresentModalPress(section)}
				>
					<Edit2 size={22} color={Colors.primary} />
				</TouchableOpacity>
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
									fontFamily: 'Outfit',
									fontSize: 12,
									fontWeight: '500',
									color: Colors.textColor + '9a',
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
		shadowColor: '#0000007d',
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
		padding: 10,
		borderRadius: 100,

		marginRight: 12
	},

	chipStyle: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20
	},

	textStyle: {
		fontFamily: 'Outfit',
		fontSize: 12,
		fontWeight: '500',
		letterSpacing: 0.2
	}
});

export default memo(EditCard);
