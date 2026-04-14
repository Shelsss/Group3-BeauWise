import { useProfilingStore } from '@/stores/useProfilingStore';
import { getAuth } from '@react-native-firebase/auth';
import { Redirect } from 'expo-router';

export default function Index() {
	const isSignedIn = getAuth().currentUser;
	const isProfilingComplete = useProfilingStore((state) => state.isProfilingComplete);
	const path = !isSignedIn
		? '(tabs)'
		: isProfilingComplete
			? '(tabs)'
			: 'profiling/index';

	return <Redirect href={path} />;
}
