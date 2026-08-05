import Tick from '@/components/icons/hugeicons/Tick';
import Warn from '@/components/icons/hugeicons/Warn';
import Colors from '@/constants/Colors';
import { X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-worklets-core';
import styles from './styles';
import Info from '@/components/icons/Info';

export default {
	successToast: ({ text1, text2, props }) => {
		return (
			<View
				style={[
					{
						backgroundColor: styles.theme.colors[props?.activeTheme]?.screen_background,
						borderWidth: props?.activeTheme === 'light' ? 2 : 0,
						borderColor:
							props?.activeTheme === 'light'
								? styles.theme.colors.primary_tint
								: 'transparent'
					},
					STYLES.base
				]}
			>
				<Tick color={styles.theme.colors[props?.activeTheme]?.icon} />
				<View>
					<Text
						style={[
							{ fontSize: 12, color: styles.theme.colors[props?.activeTheme]?.text },
							STYLES.typography
						]}
					>
						{text1}
					</Text>
					{text2 && (
						<Text
							style={[
								{
									fontSize: 10,
									color: styles.theme.colors[props?.activeTheme]?.text_secondary
								},
								STYLES.typography
							]}
						>
							{text2}
						</Text>
					)}
				</View>
			</View>
		);
	},

	errorToast: ({ text1, text2, props }) => {
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
				<View style={{ alignItems: text2 ? 'flex-start' : 'center' }}>
					<Text
						style={[
							{
								fontSize: 12,

								fontFamily: styles.font.family,
								color: styles.font.colors._04
							},
							STYLES.typography
						]}
					>
						{text1}
					</Text>
					{text2 && (
						<Text
							style={[
								{
									fontSize: 10,
									fontFamily: styles.font.family,
									color: styles.font.colors._04
								},
								STYLES.typography
							]}
						>
							{text2}
						</Text>
					)}
				</View>
			</View>
		);
	},
	infoToast: ({ text1, text2, props }) => {
		return (
			<View
				style={[
					STYLES.base,
					{
						backgroundColor: styles.theme.colors.primary
					}
				]}
			>
				<Info color='#fff' />
				<View style={{ alignItems: text2 ? 'flex-start' : 'center' }}>
					<Text
						style={[
							{
								fontSize: 12,

								fontFamily: styles.font.family,
								color: styles.font.colors._04
							},
							STYLES.typography
						]}
					>
						{text1}
					</Text>
					{text2 && (
						<Text
							style={[
								{
									fontSize: 10,
									fontFamily: styles.font.family,
									color: styles.font.colors._04
								},
								STYLES.typography
							]}
						>
							{text2}
						</Text>
					)}
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
		fontFamily: styles.font.family
	}
});
