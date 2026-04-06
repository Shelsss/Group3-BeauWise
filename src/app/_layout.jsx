import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<Stack
					initialRouteName='(tabs)'
					screenOptions={{
						animation: 'fade',
						headerBackVisible: false,
						headerShown: false
					}}
				>
					<Stack.Screen name='profiling' />

					<Stack.Screen
						name='(tabs)'
						options={{
							headerShadowVisible: false
						}}
					/>
					<Stack.Screen name='scanner' />
				</Stack>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}
