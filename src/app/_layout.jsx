import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name='(tabs)'
				options={{
					headerTitle: 'Beauwise',
					headerShadowVisible: false,
					headerStyle: { backgroundColor: '#fff' }
				}}
			/>
			<Stack.Screen
				name='scanner'
				options={{
					headerShown: false,
					presentation: 'fullScreenModal',
					animation: 'fade_from_bottom'
				}}
			/>
		</Stack>
	);
}
