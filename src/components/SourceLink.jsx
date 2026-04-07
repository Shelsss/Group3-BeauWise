import Colors from '@/constants/Colors';
import { openBrowserAsync } from 'expo-web-browser';
import { SquareArrowOutUpRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SourceLink({ name, link }) {
	const handlePress = () => {
		openBrowserAsync(link, {
			showInRecents: false
		});
	};
	return (
		<TouchableOpacity onPress={handlePress} style={{ flexDirection: 'row' }}>
			<Text
				style={{
					fontStyle: 'italic',
					fontSize: 12,
					width: '90%',
					lineHeight: 20,
					display: 'flex'
				}}
			>
				Source: {`[${name}]`}
				<View style={{ paddingLeft: 8 }}>
					<SquareArrowOutUpRight color={Colors.primary} size={12} />
				</View>
			</Text>
		</TouchableOpacity>
	);
}
