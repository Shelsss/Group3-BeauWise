import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function PageLayout({ item }) {
	return (
		<Shadow distance={1} stretch={true} startColor='#00000010' offset={[0, 1]}>
			<View style={{ backgroundColor: Colors.backgroundColor, borderRadius: 16 }}>
				<View style={{ alignItems: 'center', rowGap: 24, padding: 48 }}>
					<Image
						style={{
							aspectRatio: 1,
							width: 100
						}}
						source={item.image_url}
					/>

					<Text
						style={{
							color: Colors.primary,
							fontSize: 24,
							fontWeight: 700,
							textAlign: 'center'
						}}
					>
						{item.symbol_name}
					</Text>
				</View>

				<View style={{ height: 1, backgroundColor: Colors.textColor + '2a' }} />

				<View style={{ padding: 32, rowGap: 24 }}>
					<View>
						<Text
							style={{
								fontWeight: 700,
								color: Colors.textColor + '7a',
								textTransform: 'uppercase'
							}}
						>
							definition
						</Text>

						<Text style={{ lineHeight: 26, color: Colors.textColor }}>
							{item.definition}
						</Text>
					</View>

					<View>
						<Text
							style={{
								fontWeight: 700,
								color: Colors.textColor + '7a',
								textTransform: 'uppercase'
							}}
						>
							how to read & use
						</Text>

						<Text style={{ lineHeight: 26, color: Colors.textColor }}>
							{item.how_to_read_and_use}
						</Text>
					</View>
				</View>
			</View>
		</Shadow>
	);
}
