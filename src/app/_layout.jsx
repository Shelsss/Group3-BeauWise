import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<Stack
					initialRouteName='profiling'
					screenOptions={{
						animation: 'fade',
						headerBackVisible: false
					}}
				>
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
							headerShown: false
						}}
					/>
				</Stack>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}
