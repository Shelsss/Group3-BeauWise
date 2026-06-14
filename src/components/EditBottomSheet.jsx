import React, { useCallback, useEffect } from 'react';
import {
	Text,
	StyleSheet,
	BackHandler,
	View,
	Pressable,
	TouchableOpacity
} from 'react-native';

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
import { useAuthStore } from '@/stores/useAuthStore';
import Edit from './icons/hugeicons/Edit';
import { useProfilingStore } from '@/stores/useProfilingStore';

const EditBottomSheet = ({
	unSaveChanges = {},
	editSheetModalRef,
	selectedSection,
	profileData,
	handleUpdateProfile,
	onClose,
	onSaveToDB
}) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const { bottom } = useSafeAreaInsets();
	const { dismiss } = useBottomSheetModal();

	let isMultiSelect;
	const label = formatSnakeToTitle(selectedSection);

	const isProfilingComplete = useProfilingStore((state) => state.isProfilingComplete);

	const sectionEntries = Object.entries(profileData[selectedSection] || {});
	const sectionSchema = Questionnaire?.find(
		(item) => item.section === selectedSection
	)?.questions;

	const saveButtonDisabled = isAuthenticated && Object.keys(unSaveChanges).length <= 0;

	useEffect(() => {
		const backAction = () => {
			if (!isProfilingComplete) {
				return dismiss();
			}

			return onClose(dismiss);
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [unSaveChanges]);

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.7}
				disappearsOnIndex={-1}
				pressBehavior='none'
			/>
		),
		[]
	);
	return (
		<>
			<BottomSheetModal
				handleComponent={null}
				enablePanDownToClose={false}
				enableOverDrag={false}
				ref={editSheetModalRef}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView
					style={[styles.contentContainer, { paddingBottom: bottom + 12 }]}
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
						<View
							style={{
								marginLeft: 4,
								flexDirection: 'row',
								alignItems: 'center',
								columnGap: 14
							}}
						>
							<Edit color={Colors.textColor} />

							<View>
								<Text
									style={{
										color: Colors.textColor,
										fontSize: 16,
										fontWeight: 600,
										fontFamily: 'Outfit'
									}}
								>
									Edit {label}
								</Text>
								<Text
									style={{
										fontSize: 10,
										color: Colors.textColor + '9a',
										fontFamily: 'Outfit'
									}}
								>
									Tap the badge / chips to change them
								</Text>
							</View>
						</View>

						{!isProfilingComplete && (
							<Pressable
								onPress={() => dismiss()}
								style={{ position: 'absolute', top: 0, right: 4 }}
							>
								<X size={24} strokeWidth={2} />
							</Pressable>
						)}
					</View>

					<View style={{ display: 'flex', flexDirection: 'column', rowGap: 22 }}>
						{sectionEntries?.map(([key, value]) => (
							<View key={key}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: 600,
										color: '#252525c3',
										fontFamily: 'Outfit'
									}}
								>
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

					{isProfilingComplete && (
						<View style={{ columnGap: 8, flexDirection: 'row', marginTop: 20 }}>
							<TouchableOpacity
								onPress={() => onClose(dismiss)}
								activeOpacity={0.7}
								style={[styles.button, { backgroundColor: '#3341551a' }]}
							>
								<Text style={[styles.buttonText, { color: Colors.textColor }]}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={saveButtonDisabled}
								onPress={onSaveToDB}
								activeOpacity={0.7}
								style={[
									styles.button,
									{
										backgroundColor: Colors.primary,
										opacity: saveButtonDisabled ? 0.4 : 1
									}
								]}
							>
								<Text style={[styles.buttonText, { color: '#fff' }]}>Save Changes</Text>
							</TouchableOpacity>
						</View>
					)}
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

	button: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 16,
		borderRadius: 8
	},

	buttonText: {
		fontFamily: 'Outfit'
	},

	contentContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 20
	}
});

export default EditBottomSheet;
