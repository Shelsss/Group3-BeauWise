import { Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
export default function CreateAccountButton() {
	return (
		<TouchableOpacity
			onPress={() => router.push('authentication/sign-up')}
			activeOpacity={0.7}
			style={{
				marginTop: 6,
				paddingVertical: 14,
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: Colors.primary,
				padding: 16,
				borderRadius: 10
			}}
		>
			<View>
				<Text
					style={{ fontFamily: 'Outfit', fontWeight: 600, color: Colors.backgroundColor }}
				>
					Create Your Account
				</Text>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 12,
						color: Colors.backgroundColor,
						marginLeft: 'auto'
					}}
				>
					Start tracking your beauty journey
				</Text>
			</View>

			<ArrowRight
				style={{ marginLeft: 'auto' }}
				color={Colors.backgroundColor}
				size={18}
			/>
		</TouchableOpacity>
	);
}
