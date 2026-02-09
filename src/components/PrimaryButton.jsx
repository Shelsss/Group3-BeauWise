import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

export default function PrimaryButton({ children, handlePress }) {
	return (
		<Pressable
			style={{
				borderRadius: 24,
				overflow: 'hidden'
			}}
			android_ripple={{ color: '#e0dada6a', foreground: true }}
			onPress={handlePress}
		>
			<LinearGradient
				start={{ x: 0.3, y: 0.7 }}
				end={{ x: 1, y: 0.2 }}
				colors={['#b8a4f5', '#ffb9ca']}
				style={{
					padding: 16
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{children}
				</View>
			</LinearGradient>
		</Pressable>
	);
}
