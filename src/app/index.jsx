import { storage } from '@/config/mmkv';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { getAuth } from '@react-native-firebase/auth';
import { Redirect } from 'expo-router';

export default function Index() {
	const isOnboardingComplete = storage.getBoolean('isOnboardComplete');
	const isProfilingComplete = storage.getBoolean('isProfilingComplete');
	const isSignedIn = getAuth().currentUser;

	const path = !isOnboardingComplete
		? 'onboarding'
		: !isSignedIn
			? '(tabs)'
			: isProfilingComplete
				? '(tabs)'
				: 'profiling/index';

	return <Redirect href={path} />;
}
