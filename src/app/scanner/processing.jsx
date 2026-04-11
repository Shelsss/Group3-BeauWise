import Colors from '@/constants/Colors';
import { scanIngredient } from '@/services/cloudFunctions';
import { useScanStore } from '@/stores/useScanStore';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

export default function Processing() {
	const imageBase64 = useScanStore((state) => state.imageBase64);

	const { data, isSuccess } = useQuery({
		queryKey: ['scan'],
		queryFn: scanIngredient(imageBase64)
	});

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<LottieView
					style={{
						aspectRatio: 1,
						width: 600
					}}
					resizeMode='contain'
					speed={1.5}
					autoPlay
					loop={true}
					source={require('assets/lottie/flask-loading.json')}
				/>
				<Text
					style={{
						position: 'absolute',
						top: 400,
						fontSize: 30,
						fontWeight: 600,
						color: Colors.textColor
					}}
				>
					Loading
				</Text>
			</View>
		</View>
	);
}
