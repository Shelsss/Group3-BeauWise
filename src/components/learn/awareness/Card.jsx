import Colors from '@/constants/Colors';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Text, View, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Card({ imageSource, title, description, item, category, id }) {
	return (
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
				padding: 14,
				flexDirection: 'row',
				alignItems: 'center',
				flex: 1,
				columnGap: 12,
				backgroundColor: Colors.backgroundColor,

				shadowColor: '#00000042',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.2,
				shadowRadius: 1.41,

				elevation: 2
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
				<Text
					style={{
						color: Colors.textColor,
						fontWeight: 600,
						fontFamily: 'Outfit'
					}}
				>
					{title}
				</Text>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={{
						color: Colors.textColor + '7a',
						width: 200,
						fontFamily: 'Outfit',
						fontSize: 12
					}}
				>
					{description}
				</Text>
			</View>

			<ChevronRight
				size={16}
				color={Colors.textColor + '9a'}
				style={{ marginLeft: 'auto' }}
			/>
		</TouchableOpacity>
	);
}
