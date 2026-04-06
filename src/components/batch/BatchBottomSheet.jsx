import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, BackHandler, View, Pressable } from 'react-native';

import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	useBottomSheetModal
} from '@gorhom/bottom-sheet';

import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const brands = ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'];

const BatchBottomSheet = ({ batchSheetModalRef }) => {
	const [filter, setFilter] = useState(() => brands[0]);
	const { bottom } = useSafeAreaInsets();
	const { dismiss } = useBottomSheetModal();

	useEffect(() => {
		const backAction = () => {
			return dismiss();
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={0.7} disappearsOnIndex={-1} />,
		[]
	);

	const handlePress = (value) => () => {
		setFilter(value);
	};

	return (
		<>
			<BottomSheetModal ref={batchSheetModalRef} backdropComponent={renderBackdrop}>
				<BottomSheetView style={[styles.contentContainer, { paddingBottom: bottom }]}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',

							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 30
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
							Brands
						</Text>

						<Pressable
							onPress={() => batchSheetModalRef.current?.close()}
							style={{ position: 'absolute', top: 0, right: 4 }}
						>
							<X size={24} strokeWidth={2} />
						</Pressable>
					</View>

					<View
						style={{
							display: 'flex',
							rowGap: 16,
							marginBottom: 30
						}}
					>
						{brands.map((item, index) => (
							<Pressable
								key={`${item.toLowerCase()}`}
								onPress={handlePress(item)}
								style={{
									borderRadius: 14,
									paddingVertical: 18,
									overflow: 'hidden',
									backgroundColor: filter === item ? Colors.primary : 'transparent'
								}}
								android_ripple={{ color: '#2121212a', foreground: true }}
							>
								<Text
									style={{
										fontSize: 14,
										color: filter === item ? '#fff' : '#1E293B',
										fontWeight: 500,
										textAlign: 'center'
									}}
								>
									{item}
								</Text>
							</Pressable>
						))}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default BatchBottomSheet;
