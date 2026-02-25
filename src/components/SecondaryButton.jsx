import { Pressable, View } from 'react-native';

export default function SecondaryButton({ children, handlePress }) {
	return (
		<Pressable
			style={{
				borderRadius: 24,
				borderWidth: 1,
				borderColor: '#cfcfcf',
				backgroundColor: '#e8e8e8',
				padding: 16,
				overflow: 'hidden'
			}}
			android_ripple={{ color: '#5151516a', foreground: true }}
			onPress={handlePress}
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
		</Pressable>
	);
}
