import { Redirect } from 'expo-router';

export default function ProfilingIndex() {
	return <Redirect href={'/profiling/[0]'} />;
}
