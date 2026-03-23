import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { Shadow } from 'react-native-shadow-2';
import { Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function Card({
	imageSource,
	title,
	description,
	myths,
	mythSource,
	category,
	id
}) {
	return (
		<Shadow distance={1} stretch={true} startColor='#00000010' offset={[0, 1]}>
			<View
				style={{
					backgroundColor: Colors.backgroundColor,
					borderRadius: 16,
					overflow: 'hidden'
				}}
			>
				<Image
					recyclingKey={title}
					cachePolicy='memory-disk'
					style={{
						aspectRatio: 4 / 3
					}}
					source={imageSource}
				/>

				<View style={{ padding: 20 }}>
					<Text
						style={{
							color: Colors.textColor,
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 0.9
						}}
					>
						{title}
					</Text>

					<Text
						style={{
							width: '90%',
							color: Colors.textColor + '7a',
							fontSize: 14,
							letterSpacing: 0.9
						}}
					>
						{description}
					</Text>

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
							marginTop: 24,
							marginLeft: 'auto',
							columnGap: 4,
							borderRadius: 100,
							paddingHorizontal: 40,
							paddingVertical: 16,
							backgroundColor: Colors.primary,
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								color: Colors.backgroundColor,
								letterSpacing: 1.5,
								fontSize: 12
							}}
						>
							Read
						</Text>
						<ArrowRight size={14} color={'#fff'} />
					</TouchableOpacity>
				</View>
			</View>
		</Shadow>
	);
}
