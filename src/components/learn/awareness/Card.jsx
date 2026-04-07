import Colors from '@/constants/Colors';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Text, View, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ imageSource, title, description, item, category, id }) {
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
				<Image
					style={{
						aspectRatio: 1,
						width: 50
					}}
					recyclingKey={item.title}
					cachePolicy='memory-disk'
					source={imageSource}
				/>

				<View>
					<Text style={{ color: Colors.textColor, fontSize: 18, fontWeight: 600 }}>
						{title}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode='tail'
						style={{ color: Colors.textColor + '7a', width: 200 }}
					>
						{description}
					</Text>
				</View>

				<ChevronRight size={18} color={Colors.textColor} style={{ marginLeft: 'auto' }} />
			</TouchableOpacity>
		</Shadow>
	);
}
