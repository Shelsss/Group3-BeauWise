import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ title, description, color, children, onPress }) {
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={onPress}
			style={{
				borderRadius: 16,
				overflow: 'hidden',
				backgroundColor: '#fff',
				shadowColor: '#00000084',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.18,
				shadowRadius: 1.0,

				elevation: 1
			}}
		>
			<View
				style={{
					backgroundColor: color + '1a',

					alignItems: 'center',
					paddingVertical: 30
				}}
			>
				{children}
			</View>

			<View
				style={{
					marginVertical: 20,
					marginHorizontal: 20,
					rowGap: 6
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ color: Colors.textColor, fontSize: 20, fontWeight: 700 }}>
						{title}
					</Text>
					<ChevronRight style={{ marginLeft: 'auto' }} size={16} />
				</View>

				<Text
					style={{ lineHeight: 22, color: Colors.textColor + '9a', letterSpacing: 0.6 }}
				>
					{description}
				</Text>
			</View>
		</TouchableOpacity>
	);
}
