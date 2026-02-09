import ProfilingFooter from '@/components/profiling/ProfilingFooter';
import ProfilingHeader from '@/components/profiling/ProfilingHeader';
import { Slot } from 'expo-router';

export default function ProfilingLayout() {
	return (
		<>
			<ProfilingHeader />
			<Slot />
			<ProfilingFooter />
		</>
	);
}
