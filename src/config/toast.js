import Tick from '@/components/icons/hugeicons/Tick';
import Warn from '@/components/icons/hugeicons/Warn';
import Colors from '@/constants/Colors';
import { X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-worklets-core';

export default {
	successToast: ({ text1, text2, props }) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const width = useSharedValue();

		return (
			<View
				style={[
					{
						backgroundColor: Colors.primary
					},
					STYLES.base
				]}
			>
				<Tick color='#fff' />
				<View>
					<Text style={[{ fontSize: 12 }, STYLES.typography]}>{text1}</Text>
					<Text style={[{ fontSize: 10 }, STYLES.typography]}>{text2}</Text>
				</View>
			</View>
		);
	},

	errorToast: ({ text1, text2, props }) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const width = useSharedValue();

		return (
			<View
				style={[
					STYLES.base,
					{
						backgroundColor: '#FF8585'
					}
				]}
			>
				<Warn color='#fff' />
				<View style={{ alignItems: 'center' }}>
					<Text style={[{ fontSize: 12, textAlign: 'center' }, STYLES.typography]}>
						{text1}
					</Text>
					{text2 && <Text style={[{ fontSize: 10 }, STYLES.typography]}>{text2}</Text>}
				</View>
			</View>
		);
	}
};

const STYLES = StyleSheet.create({
	base: {
		marginHorizontal: 40,
		borderRadius: 50,
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 8
	},

	typography: {
		fontFamily: 'Outfit',

		color: '#fff'
	}
});
