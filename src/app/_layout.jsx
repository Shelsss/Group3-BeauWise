import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack initialRouteName='profiling'>
			<Stack.Screen
				name='profiling'
				options={{
					headerShown: false
				}}
			/>

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
					animation: 'fade'
				}}
			/>
		</Stack>
	);
}
