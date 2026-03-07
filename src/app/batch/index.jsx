import BatchHeader from '@/components/batch/Header';
import BatchSelect from '@/components/batch/Select';
import Batch from '@/components/icons/Batch';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import {
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Vibration,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { useRef } from 'react';
import BatchBottomSheet from '@/components/batch/BatchBottomSheet';
import BatchInput from '@/components/batch/Input';
export default function BatchScreen() {
	const router = useRouter();
	const { bottom, top } = useSafeAreaInsets();
	const batchSheetModalRef = useRef(null);

	const handlePresentModalPress = () => {
		batchSheetModalRef.current?.present();
		Vibration.vibrate(50);
	};

	const handlePress = () => {
		router.push('/batch/results');
	};

	return (
		<TouchableWithoutFeedback
			touchSoundDisabled={true}
			onPress={Keyboard.dismiss}
			accessible={false}
		>
			<View style={styles.container}>
				<BatchHeader title='Product Freshness' />

				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flex: 1,
						gap: 12,

						paddingHorizontal: 24,
						marginBottom: bottom + 20
					}}
				>
					<Text
						style={{
							paddingTop: top + 10,
							color: Colors.textColor + '7a',
							fontWeight: 400,
							fontSize: 14,
							textAlign: 'center',
							width: 300
						}}
					>
						Select a brand and enter the batch code to see if your cosmetic is fresh or
						expired.
					</Text>

					<View>
						<Batch size={250} />
					</View>

					<Shadow
						stretch={true}
						distance={2}
						startColor='#00000010'
						offset={[0, 1]}
						containerStyle={{
							width: '100%'
						}}
					>
						<View
							style={{
								backgroundColor: Colors.backgroundColor,
								padding: 16,
								borderRadius: 24,
								rowGap: 24
							}}
						>
							<View>
								<Text
									style={{
										color: Colors.textColor,
										fontWeight: 500
									}}
								>
									Brand
								</Text>
								<BatchSelect handleSelect={handlePresentModalPress} />
							</View>

							<View>
								<Text
									style={{
										color: Colors.textColor,
										fontWeight: 500
									}}
								>
									Batch Code
								</Text>
								<BatchInput />
								<Text
									style={{
										marginTop: 8,
										marginLeft: 2,
										fontSize: 12,
										color: Colors.textColor + '7a'
									}}
								>
									Usually found on the bottom of the container.
								</Text>
							</View>

							{/* This should be a primary button component */}

							<Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
								<Pressable
									onPress={handlePress}
									style={{
										columnGap: 12,
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: Colors.primary,
										padding: 16,
										borderRadius: 16
									}}
								>
									<Text
										style={{
											fontSize: 16,
											fontWeight: 600,
											color: Colors.backgroundColor
										}}
									>
										Check Freshness
									</Text>
									<CircleCheck size={16} color={Colors.backgroundColor} />
								</Pressable>
							</Shadow>
						</View>
					</Shadow>
				</View>

				<BatchBottomSheet batchSheetModalRef={batchSheetModalRef} />
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc'
	}
});
