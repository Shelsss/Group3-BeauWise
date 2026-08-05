import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, Stack, withLayoutContext } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { auth, logOut } from '@/services/auth';
import * as SplashScreen from 'expo-splash-screen';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { useCameraPermission } from 'react-native-vision-camera';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import toast from '@/config/toast';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { SystemBars } from 'react-native-edge-to-edge';
import styles from '@/config/styles';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { storage } from '@/config/mmkv';
import { doc, getDoc, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '@/services/firestore';
import { cancelAccountDeletion } from '@/services/cloudFunctions';
import { RevokeModal } from '@/components/RevokeModal';
import { CancelAccountDeletionModal } from '@/components/CancelAccountDeletionModal';

const queryClient = new QueryClient();

const JsStack = createStackNavigator();
const CustomStack = withLayoutContext(JsStack.Navigator);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const { hasPermission, requestPermission } = useCameraPermission();
	const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
	const setRevokeVisible = useAuthStore((state) => state.setRevokeVisible);
	const setCancelDeletionVisible = useAuthStore(
		(state) => state.setCancelDeletionVisible
	);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const requestPermissions = async () => {
			if (!hasPermission) {
				await requestPermission();
			}
		};

		requestPermissions();
	}, []);

	useEffect(() => {
		let unsubscribeSnapshot;
		onAuthStateChanged(auth, async () => {
			if (!!auth.currentUser) {
				unsubscribeSnapshot = onSnapshot(
					doc(db, 'users', auth.currentUser?.uid),
					async (snapshot) => {
						const data = snapshot.data();
						if (data?.tokensValidAfterTime) {
							const tokenResult = await auth.currentUser?.getIdTokenResult();

							const authTimeInSeconds = Math.floor(
								new Date(tokenResult.authTime).getTime() / 1000
							);
							if (authTimeInSeconds < data.tokensValidAfterTime) {
								await logOut();
								router.dismissAll();

								setRevokeVisible(true);
							}
						}
					}
				);

				const userRef = doc(db, 'users', auth.currentUser.uid);
				const userSnap = await getDoc(userRef);

				if (userSnap?.exists() && userSnap.data()?.status === 'PENDING_DELETION') {
					await cancelAccountDeletion();
					setCancelDeletionVisible(true);
				}

				await checkProfilingCompletion();
				setIsAuthenticated(true);
			} else {
				storage.remove('isProfilingComplete');
				setIsAuthenticated(false);
			}

			setIsReady(true);
		});

		return () => {};
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
			<SystemBars style={'inverted'} />
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<PaperProvider>
						<BottomSheetModalProvider>
							<Stack
								initialRouteName='authentication/sign-in'
								screenOptions={{
									cardStyle: {
										backgroundColor: styles.theme.colors[activeTheme].screen_background
									},
									contentStyle: {
										backgroundColor: styles.theme.colors[activeTheme].screen_background
									},
									headerBackVisible: false,
									headerShown: false
								}}
							>
								<Stack.Screen name='legal-support/[legalSupportType]' options={{}} />

								<Stack.Screen name='learn/[category]/details' options={{}} />

								<Stack.Screen
									name='onboarding/index'
									options={{
										animation: 'fade'
									}}
								/>
								<Stack.Screen
									name='(tabs)'
									options={{
										animation: 'fade'
									}}
								/>
								<Stack.Screen
									name='scanner/initial_page'
									options={{
										animation: 'fade'
									}}
								/>

								<Stack.Screen
									name='scanner/scan'
									options={{
										animation: 'fade'
									}}
								/>

								<Stack.Screen
									name='scanner/details'
									options={{
										animation: 'slide_from_right'
									}}
								/>
							</Stack>
							<Toast config={toast} />
							<RevokeModal />
							<CancelAccountDeletionModal />
						</BottomSheetModalProvider>
					</PaperProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</>
	);
}
{
	/* <CustomStack
	initialRouteName='authentication/sign-in'
	screenOptions={{
		detachInactiveScreens: false,
		cardStyle: {
			backgroundColor: styles.theme.colors[activeTheme].screen_background
		},

		headerBackVisible: false,
		headerShown: false,
		animation: 'slide_from_right',
		freezeOnBlur: true
	}}
>
	<CustomStack.Screen
		name='legal-support/[legalSupportType]'
		options={{
			animation: 'slide_from_right',
			gestureEnabled: true,
			gestureDirection: 'horizontal',
			presentation: 'modal',
			gestureResponseDistance: 2000
		}}
	/>

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
	<CustomStack.Screen
		name='scanner/initial_page'
		options={{
			presentation: 'modal',
			animation: 'scale_from_center'
			// gestureEnabled: true,
			// keyboardHandlingEnabled: false,
			// gestureDirection: 'vertical-inverted',
			// gestureVelocityImpact: 0.5
		}}
	/>

	<CustomStack.Screen
		name='scanner/scan'
		options={{
			presentation: 'modal',
			animation: 'reveal_from_bottom'
		}}
	/>
</CustomStack>; */
}
