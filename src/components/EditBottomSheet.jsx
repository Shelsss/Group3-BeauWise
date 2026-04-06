import React, { useCallback, useEffect } from 'react';
import { Text, StyleSheet, BackHandler, View, Pressable } from 'react-native';

import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	useBottomSheetModal
} from '@gorhom/bottom-sheet';

import { Pencil, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import PressableBadge from '@/components/PressableBadge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import Questionnaire from '@/constants/Questionnaire';

const EditBottomSheet = ({
	editSheetModalRef,
	selectedSection,
	profileData,
	handleUpdateProfile
}) => {
	const { bottom } = useSafeAreaInsets();
	const { dismiss } = useBottomSheetModal();

	let isMultiSelect;
	const label = formatSnakeToTitle(selectedSection);
	const sectionEntries = Object.entries(profileData[selectedSection] || {});
	const sectionSchema = Questionnaire?.find(
		(item) => item.section === selectedSection
	)?.questions;

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

	return (
		<>
			<BottomSheetModal ref={editSheetModalRef} backdropComponent={renderBackdrop}>
				<BottomSheetView
					style={[styles.contentContainer, { paddingBottom: bottom + 20 }]}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							width: '100%',
							marginBottom: 30
						}}
					>
						<View style={styles.iconStyle}>
							<Pencil size={18} color={Colors.primary} strokeWidth={1} />
						</View>

						<View>
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit {label}</Text>
							<Text style={{ fontSize: 10, color: '#666' }}>
								Tap the badge / chips to change them
							</Text>
						</View>

						<Pressable
							onPress={() => editSheetModalRef.current?.close()}
							style={{ position: 'absolute', top: 0, right: 4 }}
						>
							<X size={24} strokeWidth={2} />
						</Pressable>
					</View>

					<View style={{ display: 'flex', flexDirection: 'column', rowGap: 22 }}>
						{sectionEntries?.map(([key, value]) => (
							<View key={key}>
								<Text style={{ fontSize: 14, fontWeight: 'bold', color: '#252525c3' }}>
									{formatSnakeToTitle(key)}
								</Text>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										flexWrap: 'wrap',
										gap: 10,
										marginTop: 8
									}}
								>
									{sectionSchema
										?.find((item) => {
											if (item.identifier === key) {
												isMultiSelect = item?.multiSelect;
												return true;
											}
										})
										?.options.map((option) => {
											return (
												<PressableBadge
													key={`${key}-${option.value}`}
													label={option?.label}
													activeCondition={
														isMultiSelect
															? profileData[selectedSection][key].includes(option?.value)
															: value === option?.value
													}
													handlePress={handleUpdateProfile(key, option?.value)}
												/>
											);
										})}
								</View>
							</View>
						))}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	padding: 24,
	// 	justifyContent: 'center',
	// 	backgroundColor: 'grey'
	// },
	contentContainer: {
		flex: 1,
		paddingHorizontal: 16
	},

	iconStyle: {
		backgroundColor: Colors.primary + '40',
		padding: 10,
		borderRadius: 100,
		borderColor: Colors.primary + '4D',
		marginRight: 12,
		borderWidth: 1
	}
});

export default EditBottomSheet;
