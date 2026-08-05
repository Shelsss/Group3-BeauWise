import AiScan from '@/components/icons/hugeicons/AiScan';
import Image from '@/components/icons/hugeicons/FooImage';
import Keyboard from '@/components/icons/hugeicons/Keyboard';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
export default [
	{
		title: 'Manual',
		icon: (size, color) => <Keyboard size={size} color={color} />,
		action: () => () => router.push('scanner/details')
	},

	{
		title: 'Image',
		icon: (size, color) => <Image size={size} color={color} />,
		action: (setImageBase64) => async () => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				base64: true,
				selectionLimit: 1,
				allowsEditing: true,
				allowsMultipleSelection: false,
				aspect: [3, 4],
				quality: 1
			});

			if (result.canceled) return;

			setImageBase64(result.assets[0].base64);
			router.replace({
				pathname: 'scanner/processing',
				params: { from: 'library' }
			});
		}
	},

	{
		title: 'Scan',
		icon: (size, color) => <AiScan size={size} color={color} />,
		action: () => () => router.push('scanner/scan')
	}
];
