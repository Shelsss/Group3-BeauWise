import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack, withLayoutContext } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { auth } from '@/services/auth';
import * as SplashScreen from 'expo-splash-screen';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { useCameraPermission } from 'react-native-vision-camera';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import toast from '@/config/toast';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { setStatusBarHidden } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
const queryClient = new QueryClient();

const JsStack = createStackNavigator();
const CustomStack = withLayoutContext(JsStack.Navigator);

SplashScreen.preventAutoHideAsync();
NavigationBar.setStyle('light');
setStatusBarHidden(true);
export default function RootLayout() {
	const { hasPermission, requestPermission } = useCameraPermission();
	const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
	const setIsOnboardingComplete = useOnboardingStore(
		(state) => state.setIsOnboardingComplete
	);

	const setIsProfilingComplete = useProfilingStore(
		(state) => state.setIsProfilingComplete
	);

	const [isReady, setIsReady] = useState(false);
	useEffect(() => {
		const requestPermissions = async () => {
			if (!hasPermission) {
				await requestPermission();
			}
		};

		const getOnboardStatus = async () => {
			let status;
			try {
				status = await AsyncStorage.getItem('isOnboardComplete');
				status = JSON.parse(status);
			} catch (error) {
				status = false;
				console.log(error);
			} finally {
				setIsOnboardingComplete(status);
			}
		};

		requestPermissions();
		getOnboardStatus();
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async () => {
			if (!!auth.currentUser) {
				const isProfilingComplete = await checkProfilingCompletion();

				setIsAuthenticated(true);
				setIsProfilingComplete(isProfilingComplete);
			} else {
				AsyncStorage.removeItem('hasProfilingBeenCompleted');
				setIsProfilingComplete(false);
				setIsAuthenticated(false);
			}

			setIsReady(true);
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (isReady) {
			SplashScreen.hideAsync();
		}
	}, [isReady]);

	if (!isReady) {
		return null;
	}

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<PaperProvider>
						<BottomSheetModalProvider>
							<CustomStack
								initialRouteName='authentication/sign-in'
								screenOptions={{
									cardStyle: { backgroundColor: '#f8fafc' },
									headerBackVisible: false,
									headerShown: false,
									animation: 'slide_from_right'
								}}
							>
								<CustomStack.Screen
									name='authentication/sign-in'
									options={{
										animation: 'reveal_from_bottom'
									}}
								/>
								<CustomStack.Screen name='profiling' />

								<CustomStack.Screen name='legal-support/[legalSupportType]' />
								<CustomStack.Screen
									name='learn/[category]/details'
									options={{
										animation: 'reveal_from_bottom'
									}}
								/>

								<CustomStack.Screen
									name='onboarding/index'
									options={{
										animation: 'fade'
									}}
								/>
								<CustomStack.Screen
									name='(tabs)'
									options={{
										animation: 'fade',
										headerShadowVisible: false
									}}
								/>
								<CustomStack.Screen name='scanner/index' />
							</CustomStack>
							<Toast config={toast} />
						</BottomSheetModalProvider>
					</PaperProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</>
	);
}
