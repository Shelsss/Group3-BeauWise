import Colors from '@/constants/Colors';
import { TouchableOpacity, View } from 'react-native';

export default function PrimaryButton({
	children,
	handlePress,
	styles,
	containerStyle,
	disabled
}) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			style={[
				{
					backgroundColor: Colors.primary,
					padding: 16,
					borderRadius: 24,
					overflow: 'hidden',
					shadowColor: '#00000052',
					shadowOffset: {
						width: 0,
						height: 0
					},
					shadowOpacity: 0.17,
					shadowRadius: 3.05,
					elevation: 4,
					opacity: disabled ? 0.3 : 1
				},
				{ ...containerStyle }
			]}
			disabled={disabled}
			onPress={handlePress}
		>
			<View
				style={[
					{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					},
					{ ...styles }
				]}
			>
				{children}
			</View>
		</TouchableOpacity>
	);
}
