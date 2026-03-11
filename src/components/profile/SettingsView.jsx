import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { ChevronRight } from 'lucide-react-native';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const settingSchema = [
	{
		title: 'Account',
		sets: ['Change Password', 'Update Email']
	},

	{
		title: 'Danger Zone',
		color: '#ff7a7c',
		sets: ['Log Out', 'Delete Account']
	},

	{
		title: 'Legal & Support',
		sets: ['Terms of Service', 'Privacy Policy', 'About Us', 'Contact Support']
	}
];

export default function SettingsView({ isVisible }) {
	return (
		<View
			style={{
				flex: 1,
				paddingTop: PagePadding.config.paddingTop,
				paddingBottom: PagePadding.config.paddingBottom,
				paddingHorizontal: PagePadding.config.paddingHorizontal + 10,
				rowGap: 30,

				display: isVisible ? 'flex' : 'none'
			}}
		>
			{settingSchema.map((item, itemIndex) => (
				<View key={item.title + `-${itemIndex}`} style={STYLES.container}>
					<Text style={[STYLES.titleStyle, item?.color && { color: item?.color }]}>
						{item.title}
					</Text>
					<View style={STYLES.itemContainerStyle}>
						{item.sets.map((set, setIndex) => (
							<View key={set + `-${setIndex}`}>
								<TouchableOpacity style={[STYLES.itemStyle]}>
									<Text
										style={[STYLES.itemTextStyle, item?.color && { color: item?.color }]}
									>
										{set}
									</Text>
									<ChevronRight size={14} />
								</TouchableOpacity>
								{setIndex !== item.sets.length - 1 && <Seperator />}
							</View>
						))}
					</View>
				</View>
			))}
		</View>
	);
}

function Seperator() {
	return <View style={{ height: 1, backgroundColor: Colors.textColor + '1a' }} />;
}

const STYLES = StyleSheet.create({
	container: {
		rowGap: 6
	},

	titleStyle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.textColor
	},

	itemContainerStyle: {
		borderRadius: 16,
		backgroundColor: Colors.backgroundColor,
		shadowColor: '#000000b8',
		shadowOffset: {
			width: 0,
			height: 0.5
		},
		shadowOpacity: 0.15,
		shadowRadius: 1.0,
		elevation: 1
	},

	itemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16
	},

	itemTextStyle: {
		fontSize: 16,
		fontWeight: '400',
		color: Colors.textColor,
		marginRight: 'auto'
	}
});
