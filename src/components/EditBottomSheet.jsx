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
	useBottomSheetModal,
	useBottomSheetSpringConfigs
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
import styles from '@/config/styles';
import { storage } from '@/config/mmkv';

const EditBottomSheet = ({
	activeTheme,
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

	const isProfilingComplete = storage.getBoolean('isProfilingComplete');

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
				opacity={1}
				disappearsOnIndex={-1}
				pressBehavior='none'
			/>
		),
		[]
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	console.log(sectionSchema);

	return (
		<>
			<BottomSheetModal
				animationConfigs={animationConfigs}
				handleComponent={null}
				enablePanDownToClose={false}
				enableOverDrag={false}
				ref={editSheetModalRef}
				backgroundStyle={{
					borderRadius: styles.border.radius.size.sm,
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView
					style={[STYLES.contentContainer, { paddingBottom: bottom + 12 }]}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
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
							<Edit
								color={styles.theme.colors[activeTheme].icon}
								size={styles.icon.size.xl * 1.2}
							/>

							<View>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].text,
										fontSize: styles.font.size.lg,
										fontWeight: styles.font.weight.semi_bold,
										fontFamily: styles.font.family
									}}
								>
									Edit {label}
								</Text>
								<Text
									style={{
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text_secondary,
										fontFamily: styles.font.family
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
						{sectionEntries?.map(([key, value]) => {
							const question = sectionSchema.find(
								({ identifier }) => identifier === key
							).label;

							return (
								<View key={key}>
									<Text
										style={{
											fontSize: styles.font.size.md,
											fontWeight: styles.font.weight.semi_bold,
											color: styles.theme.colors[activeTheme].text,
											fontFamily: styles.font.family
										}}
									>
										{question}
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
														activeTheme={activeTheme}
														key={`${key}-${option.value}`}
														label={option?.label}
														activeCondition={
															isMultiSelect
																? profileData[selectedSection][key].includes(
																		option?.value
																	)
																: value === option?.value
														}
														handlePress={handleUpdateProfile(key, option?.value)}
													/>
												);
											})}
									</View>
								</View>
							);
						})}
					</View>

					{isProfilingComplete && (
						<View style={{ columnGap: 8, flexDirection: 'row', marginTop: 20 }}>
							<TouchableOpacity
								onPress={() => onClose(dismiss)}
								activeOpacity={0.7}
								style={[
									STYLES.button,
									{ backgroundColor: activeTheme === 'light' ? '#3341551a' : '#908f8f1a' }
								]}
							>
								<Text
									style={[
										STYLES.buttonText,
										{ color: styles.theme.colors[activeTheme].text }
									]}
								>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={saveButtonDisabled}
								onPress={onSaveToDB}
								activeOpacity={0.7}
								style={[
									STYLES.button,
									{
										backgroundColor: Colors.primary,
										opacity: saveButtonDisabled ? 0.4 : 1
									}
								]}
							>
								<Text style={[STYLES.buttonText, { color: styles.font.colors._04 }]}>
									Save Changes
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const STYLES = StyleSheet.create({
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
		fontFamily: styles.font.family
	},

	contentContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 20
	}
});

export default EditBottomSheet;
