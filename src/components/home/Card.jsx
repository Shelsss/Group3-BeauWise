import styles from '@/config/styles';
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
					borderRadius: styles.border.radius.size.md,
					overflow: 'hidden'
				},
				containerStyle
			]}
		>
			{children}
		</Pressable>
	);
}
