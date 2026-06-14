import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { getAuth } from '@react-native-firebase/auth';
import { Redirect } from 'expo-router';

export default function Index() {
	const isOnboardingComplete = useOnboardingStore((state) => state.isOnboardingComplete);
	const isSignedIn = getAuth().currentUser;
	const isProfilingComplete = useProfilingStore((state) => state.isProfilingComplete);

	const path = !isOnboardingComplete
		? 'onboarding'
		: !isSignedIn
			? '(tabs)'
			: isProfilingComplete
				? '(tabs)'
				: 'profiling/index';

	return <Redirect href={path} />;
}
