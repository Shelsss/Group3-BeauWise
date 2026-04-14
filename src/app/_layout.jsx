import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { auth } from '@/services/auth';
import * as SplashScreen from 'expo-splash-screen';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { useCameraPermission } from 'react-native-vision-camera';
import { usePermissions } from 'expo-media-library';
const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const { hasPermission, requestPermission } = useCameraPermission();
	const [writePermission, requestWritePermission] = usePermissions({ writeOnly: true });
	const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
	const setIsProfilingComplete = useProfilingStore(
		(state) => state.setIsProfilingComplete
	);

	const [isReady, setIsReady] = useState(false);
	useEffect(() => {
		const requestPermissions = async () => {
			if (!hasPermission || !writePermission?.status !== 'granted') {
				await requestPermission();
				await requestWritePermission();
			}
		};

		requestPermissions();
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const isProfilingComplete = await checkProfilingCompletion();
				setIsAuthenticated(true);
				setIsProfilingComplete(isProfilingComplete);
			} else {
				setIsAuthenticated(false);
			}

			setIsReady(true);
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (isReady) {
			SplashScreen.hide();
		}
	}, [isReady]);

	if (!isReady) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<BottomSheetModalProvider>
					<Stack
						initialRouteName='authentication/sign-in'
						screenOptions={{
							contentStyle: { backgroundColor: '#f8fafc' },
							animation: 'flip',
							headerBackVisible: false,
							headerShown: false
						}}
					>
						<Stack.Screen name='authentication/sign-in' />
						<Stack.Screen name='profiling' />

						<Stack.Screen
							name='legal-support/[legalSupportType]'
							options={{
								animation: 'flip'
							}}
						/>
						<Stack.Screen
							name='(tabs)'
							options={{
								animation: 'fade',
								headerShadowVisible: false
							}}
						/>
						<Stack.Screen
							name='scanner/index'
							options={{
								animation: 'fade_from_bottom'
							}}
						/>
					</Stack>
					<Toast />
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
