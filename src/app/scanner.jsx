import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScannerScreen() {
	const router = useRouter();
	const { top } = useSafeAreaInsets();

	return (
		<View style={styles.container}>
			<Pressable
				testID='back-button'
				accessibilityRole='button'
				style={[styles.closeButton, { top: top + 10 }]}
				onPress={() => router.back()}
			>
				<X color='#181818' size={28} />
			</Pressable>

			<View>
				<Text>Scan Route</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fefeff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	closeButton: {
		position: 'absolute',
		left: 20,
		zIndex: 10,
		padding: 8
	}
});
