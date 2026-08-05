import Logo from '@/components/icons/Logo';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Index() {
	useEffect(() => {
		const timer = setInterval(() => {
			router.replace('onboarding/onboarding-pager');
		}, 2000);

		return () => clearInterval(timer);
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				marginHorizontal: 20
			}}
		>
			<View
				style={{
					alignSelf: 'center',
					marginBottom: 30,
					position: 'relative'
				}}
			>
				<View>
					<Logo size={120} />
				</View>
			</View>
		</View>
	);
}
