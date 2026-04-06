import { Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ handleNavigate, children, containerStyle }) {
	return (
		<Shadow
			stretch={true}
			distance={0.5}
			offset={[0, 1]}
			containerStyle={{ flex: 1 }}
			style={{ flex: 1 }}
		>
			<Pressable
				onPress={handleNavigate}
				android_ripple={{ color: '#9797976a', foreground: true }}
				style={[
					{
						flex: 1,
						borderRadius: 16,
						padding: 16,
						overflow: 'hidden'
					},
					containerStyle
				]}
			>
				{children}
			</Pressable>
		</Shadow>
	);
}
