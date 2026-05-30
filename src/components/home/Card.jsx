import { Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ handleNavigate, children, containerStyle }) {
	return (
		<Pressable
			onPress={handleNavigate}
			android_ripple={{ color: '#e3e3e36a', foreground: true }}
			style={[
				{
					flex: 1,
					borderRadius: 16,
					padding: 16,
					overflow: 'hidden',

					shadowColor: '#00000023',
					shadowOffset: {
						width: 0,
						height: 1
					},
					shadowOpacity: 0.2,
					shadowRadius: 1.41,

					elevation: 2
				},
				containerStyle
			]}
		>
			{children}
		</Pressable>
	);
}
