import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import Sparks from '@/components/icons/hugeicons/Sparks';
import Logo from '@/components/icons/Logo';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
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

				<View style={{ position: 'absolute', right: -21, top: 20 }}>
					<Sparks color={Colors.secondary} />
				</View>

				<View
					style={{
						position: 'absolute',
						bottom: -8,
						left: -17,

						transform: [{ rotateZ: '180deg' }]
					}}
				>
					<Sparks color={Colors.primary} />
				</View>
			</View>

			<TouchableOpacity
				onPress={() => router.push('onboarding/onboarding-pager')}
				activeOpacity={0.7}
				style={{
					backgroundColor: Colors.primary,
					borderRadius: 10,
					paddingVertical: 14,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					columnGap: 2
				}}
			>
				<Text
					style={{
						color: '#fff',
						fontFamily: 'Outfit',
						fontSize: 12,
						fontWeight: 500,
						marginBottom: 'auto'
					}}
				>
					Get Started
				</Text>

				<ArrowRight size={16} color='#fff' />
			</TouchableOpacity>
		</View>
	);
}
