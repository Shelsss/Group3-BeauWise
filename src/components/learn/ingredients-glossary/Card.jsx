import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({
	id,
	title,
	category,
	categories = ['Emollient', 'Antioxidant', 'Moisturizer']
}) {
	return (
		<Shadow distance={1} stretch={true} startColor='#00000010' offset={[0, 1]}>
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: `/learn/${category}/details`,
						params: {
							selectedItem: id
						}
					});
				}}
				activeOpacity={0.8}
				style={{
					borderRadius: 16,
					padding: 20,
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
					columnGap: 12,
					backgroundColor: Colors.backgroundColor
				}}
			>
				<View>
					<Text style={{ color: Colors.textColor, fontSize: 16, fontWeight: 600 }}>
						{title}
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<>
							<Text
								numberOfLines={1}
								ellipsizeMode='tail'
								style={{
									width: 250,
									fontSize: 10,
									color: Colors.textColor + '7a',
									fontWeight: 500
								}}
							>
								{categories.join('  •  ')}
							</Text>
						</>
					</View>
				</View>

				<ChevronRight size={18} color={Colors.textColor} style={{ marginLeft: 'auto' }} />
			</TouchableOpacity>
		</Shadow>
	);
}
