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
				style={[styles.closeButton, { top: top + 10 }]}
				onPress={() => router.back()}
			>
				<X color='white' size={28} />
			</Pressable>

			<View style={styles.scanArea}>
				<View style={styles.scanFrame}>
					<View style={[styles.corner, styles.topLeft]} />
					<View style={[styles.corner, styles.topRight]} />
					<View style={[styles.corner, styles.bottomLeft]} />
					<View style={[styles.corner, styles.bottomRight]} />
				</View>
			</View>

			<Text style={styles.title}>Scan QR Code</Text>
			<Text style={styles.subtitle}>Position the QR code within the frame</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1a1a2e',
		alignItems: 'center',
		justifyContent: 'center'
	},
	closeButton: {
		position: 'absolute',
		left: 20,
		zIndex: 10,
		padding: 8
	},
	scanArea: {
		width: 250,
		height: 250,
		alignItems: 'center',
		justifyContent: 'center'
	},
	scanFrame: {
		width: '100%',
		height: '100%',
		position: 'relative'
	},
	corner: {
		position: 'absolute',
		width: 40,
		height: 40,
		borderColor: '#a78bfa'
	},
	topLeft: {
		top: 0,
		left: 0,
		borderTopWidth: 4,
		borderLeftWidth: 4,
		borderTopLeftRadius: 8
	},
	topRight: {
		top: 0,
		right: 0,
		borderTopWidth: 4,
		borderRightWidth: 4,
		borderTopRightRadius: 8
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		borderBottomWidth: 4,
		borderLeftWidth: 4,
		borderBottomLeftRadius: 8
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		borderBottomWidth: 4,
		borderRightWidth: 4,
		borderBottomRightRadius: 8
	},
	title: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 40
	},
	subtitle: {
		color: '#9ca3af',
		fontSize: 14,
		marginTop: 8
	}
});
