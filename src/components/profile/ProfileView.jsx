import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { View, Text, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import EditBottomSheet from '@/components/EditBottomSheet';
import EditCard from '@/components/EditCard';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import { useEffect, useRef, useState } from 'react';
import { icons } from '@/constants/IconTheme';

import { useAuthStore } from '@/stores/useAuthStore';
import GuessModeView from './GuessModeView';
import {
	doc,
	getDoc,
	getFirestore,
	query,
	setDoc,
	updateDoc
} from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { UserRound } from 'lucide-react-native';
import { Swing } from 'react-native-animated-spinkit';
import Retry from '../Retry';
import { Modal, Portal } from 'react-native-paper';
import Warn from '../icons/hugeicons/Warn';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Questionnaire from '@/constants/Questionnaire';
import Toast from 'react-native-toast-message';

const db = getFirestore();

const fetchData = async () => {
	const queryOption = query(doc(db, 'users', auth.currentUser.uid));

	const documentSnapshot = await getDoc(queryOption);

	return documentSnapshot.data();
};

const arraysEqual = (a, b) => {
	if (a === b) {
		return true;
	}
	if (a == null || b == null) {
		return false;
	}
	if (a.length !== b.length) return false;

	a = [...a.sort()];
	b = [...b.sort()];

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};

const formatArrayChanges = (items, section, key, value) => {
	let currentArray = [...items];

	const foo = Questionnaire.find((item) => item.section === section)
		.questions.find(({ identifier }) => identifier === key)
		.options.find(({ label }) => label.includes('None'));

	if (currentArray.includes(value)) {
		const updatedArray = currentArray.filter((item) => item !== value);

		if (updatedArray.length < 1) {
			return currentArray;
		}
		return updatedArray;
	}

	if (currentArray.includes(foo?.value)) {
		currentArray = currentArray.filter((item) => item !== foo?.value);
	}

	if (value === foo?.value) {
		return [value];
	}

	currentArray.push(value);

	return [...currentArray];
};

export default function ProfileView({ isVisible }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const editSheetModalRef = useRef(null);
	const [selectedSection, setSelectedSection] = useState('');
	const profileData = useProfilingStore((state) => state.profile);
	const updateProfile = useProfilingStore((state) => state.setProfile);
	const populateProfile = useProfilingStore((state) => state.populateProfile);
	const isProfilingComplete = useProfilingStore((state) => state.isProfilingComplete);

	const [unSaveChanges, setUnSaveChanges] = useState({});

	const [visible, setVisible] = useState(false);
	const [staleProfilingData, setStaleProfilingData] = useState({});

	const showModal = () => setVisible(true);
	const closeModal = () => setVisible(false);

	const { data, refetch, isLoading, isError, isRefetchError, isRefetching, isSuccess } =
		useQuery({
			queryKey: [`${auth.currentUser?.uid}-profile`],
			queryFn: fetchData,
			enabled: !!isAuthenticated && isProfilingComplete
		});

	const profileMutation = useMutation({
		mutationFn: async (newChanges) => {
			await setDoc(
				doc(db, 'users', auth.currentUser?.uid),
				{
					profiling: {
						[selectedSection]: newChanges
					}
				},
				{ merge: true }
			);
		},

		onMutate: () => editSheetModalRef.current?.dismiss(),
		onError: () => {
			Object.keys(unSaveChanges).forEach((key) => {
				updateProfile(selectedSection, key, staleProfilingData[selectedSection][key]);
			});

			setUnSaveChanges({});

			Toast.show({
				type: 'errorToast',
				text1: 'Oops, save failed!',
				text2: 'Please verify your connection and attempt to save again.',
				bottomOffset: 20
			});
		},
		onSuccess: () => {
			Object.keys(unSaveChanges).forEach((key) => {
				let value = Array.isArray(unSaveChanges[key])
					? [...unSaveChanges[key]]
					: unSaveChanges[key];

				updateProfile(selectedSection, key, value);

				setStaleProfilingData((prev) => {
					return {
						...prev,
						[selectedSection]: {
							...prev[selectedSection],
							[key]: value
						}
					};
				});
			});

			setUnSaveChanges({});

			Toast.show({
				type: 'successToast',
				text1: 'Changes saved.',
				text2: 'Your profile has been successfully updated.',
				bottomOffset: 20
			});
		}
	});

	const getIcon = (section) => {
		const mappedIcon = icons.find(({ id }) => id === section);
		return mappedIcon.icon(20, Colors.primary);
	};

	const retry = () =>
		refetch({
			throwOnError: true
		});

	const handlePresentModalPress = (section) => () => {
		setSelectedSection(section);
		editSheetModalRef.current?.present();
	};

	const handleUpdateProfile = (key, value) => async () => {
		let previous = staleProfilingData[selectedSection][key];

		updateProfile(selectedSection, key, value);
		if (Array.isArray(previous)) {
			previous = [...previous];
			let cleanedChanges;

			if (key in unSaveChanges) {
				const previousUnsaveItems = unSaveChanges[key];

				cleanedChanges = formatArrayChanges(
					previousUnsaveItems,
					selectedSection,
					key,
					value
				);
			} else {
				const initialData = profileData[selectedSection][key];
				cleanedChanges = formatArrayChanges(initialData, selectedSection, key, value);
			}

			let isEqual = arraysEqual(previous, cleanedChanges);

			if (isEqual) {
				const cleanedChanges = { ...unSaveChanges };

				delete cleanedChanges[key];

				setUnSaveChanges({ ...cleanedChanges });
			} else {
				setUnSaveChanges({ ...unSaveChanges, [key]: [...cleanedChanges] });
			}

			return;
		}

		if (previous === value) {
			const cleanedChanges = { ...unSaveChanges };

			delete cleanedChanges[key];

			setUnSaveChanges({ ...cleanedChanges });
		} else {
			setUnSaveChanges({ ...unSaveChanges, [key]: value });
		}
	};

	const onClose = (dismiss) => {
		if (Object.keys(unSaveChanges).length <= 0) {
			return dismiss();
		}

		showModal();
		return true;
	};

	const onDiscardClose = () => {
		closeModal();
		editSheetModalRef.current.dismiss();

		Object.keys(unSaveChanges).forEach((key) => {
			let value = Array.isArray(staleProfilingData[selectedSection][key])
				? [...staleProfilingData[selectedSection][key]]
				: staleProfilingData[selectedSection][key];

			updateProfile(selectedSection, key, value);
		});

		setUnSaveChanges({});
	};

	const onSaveToDB = () => {
		profileMutation.mutate(unSaveChanges);
	};

	useEffect(() => {
		if (isSuccess) {
			setStaleProfilingData({ ...staleProfilingData, ...data.profiling });
			populateProfile(data.profiling);
		}
	}, [isSuccess, isAuthenticated]);

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: PagePadding.config.paddingHorizontal,
				rowGap: 25,
				paddingTop: PagePadding.config.paddingTop + 10,
				paddingBottom: 40,
				zIndex: -999,
				display: isVisible ? 'flex' : 'none'
			}}
		>
			{isError && isAuthenticated && (
				<View style={{ flex: 1, marginTop: '68%' }}>
					<Retry refetch={retry} />
				</View>
			)}

			{!isAuthenticated && <GuessModeView />}
			{isLoading && isAuthenticated ? (
				<View
					style={{
						flex: 1,
						padding: 18,
						borderRadius: 10,
						marginTop: '40%',
						justifyContent: 'center',
						alignItems: 'center',
						rowGap: 8
					}}
				>
					<Swing size={28} color={Colors.primary} />
					<Text
						style={{
							fontFamily: 'Outfit',
							fontWeight: 500
						}}
					>
						Loading...
					</Text>
				</View>
			) : (
				<View
					style={{
						rowGap: 20
					}}
				>
					{isAuthenticated && (
						<>
							<View
								style={{
									padding: 24,
									backgroundColor: Colors.backgroundColor,
									borderRadius: 16,
									alignItems: 'center',

									shadowColor: '#0000009f',
									shadowOffset: {
										width: 0,
										height: 1
									},
									shadowOpacity: 0.15,
									shadowRadius: 1.0,
									elevation: 1
								}}
							>
								{auth?.currentUser?.photoURL ? (
									<Image
										cachePolicy='disk'
										style={{
											aspectRatio: 1,
											width: 60,
											marginBottom: 16,
											borderRadius: 30
										}}
										source={auth?.currentUser?.photoURL}
									/>
								) : (
									<View
										style={{
											backgroundColor: Colors.primary + '1a',
											padding: 16,
											borderRadius: 30,
											marginBottom: 16,
											overflow: 'hidden'
										}}
									>
										<UserRound size={28} color={Colors.primary} />
									</View>
								)}

								<Text
									style={{
										fontFamily: 'Outfit',
										fontSize: 20,
										fontWeight: 600,
										color: Colors.textColor
									}}
								>
									{auth?.currentUser?.displayName}
								</Text>
								<Text
									style={{
										fontSize: 14,
										color: Colors.textColor + '7a',
										fontFamily: 'Outfit'
									}}
								>
									{auth?.currentUser?.email}
								</Text>
							</View>

							{data?.profiling &&
								Object.keys(profileData).map((section, index) => (
									<EditCard
										profileData={profileData}
										label={formatSnakeToTitle(section)}
										section={section}
										key={section}
										sectionValue={Object.entries(profileData[section])}
										handlePresentModalPress={handlePresentModalPress}
										iconProp={getIcon(section)}
										iconColor={Colors.primary}
									/>
								))}
						</>
					)}

					{isAuthenticated && (
						<View
							style={{
								backgroundColor: '#e8f5e9',
								padding: 16,
								borderRadius: 16
							}}
						>
							<Text
								style={{ fontWeight: 600, color: Colors.textColor, fontFamily: 'Outfit' }}
							>
								Profile Notice
							</Text>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontSize: 12,
									color: Colors.textColor + '9a'
								}}
							>
								Your self-reported profile is used strictly for educational ingredient
								matching. It is not a medical diagnosis. Always consult a licensed
								dermatologist for skin conditions or medical concerns.
							</Text>
						</View>
					)}
				</View>
			)}

			{data?.profiling && (
				<EditBottomSheet
					unSaveChanges={unSaveChanges}
					onClose={onClose}
					onSaveToDB={onSaveToDB}
					profileData={profileData}
					editSheetModalRef={editSheetModalRef}
					selectedSection={selectedSection}
					setSelectedSection={setSelectedSection}
					handleUpdateProfile={handleUpdateProfile}
				/>
			)}

			<Portal>
				<Modal
					visible={visible}
					dismissable={false}
					style={{ alignItems: 'center' }}
					dismissableBackButton={false}
				>
					<View
						style={{
							rowGap: 8,
							alignItems: 'center',
							backgroundColor: Colors.backgroundColor,
							padding: 16,
							borderRadius: 8
						}}
					>
						<Warn color='#ff7a7c' size={40} />

						<View>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontWeight: 500,
									textAlign: 'center',
									fontSize: 16
								}}
							>
								Hang on a second.
							</Text>

							<Text style={{ fontFamily: 'Outfit' }}>
								Any edits you made here will be lost.
							</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',
								marginTop: 10,
								alignSelf: 'flex-end',
								columnGap: 8
							}}
						>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={onDiscardClose}
								style={{
									backgroundColor: '#ff7a7c1a',
									paddingVertical: 14,
									paddingHorizontal: 16,
									borderRadius: 8
								}}
							>
								<Text style={{ fontFamily: 'Outfit', color: '#ff7a7c' }}>Discard</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={closeModal}
								activeOpacity={0.7}
								style={{
									backgroundColor: Colors.primary,
									paddingVertical: 14,
									paddingHorizontal: 16,
									borderRadius: 8
								}}
							>
								<Text style={{ fontFamily: 'Outfit', color: '#fff' }}>Keep Editing</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<Modal
					style={{
						marginHorizontal: PagePadding.config.paddingHorizontal
					}}
					visible={profileMutation.isPending}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							padding: 18,
							borderRadius: 10,
							backgroundColor: Colors.backgroundColor,
							alignItems: 'center',
							rowGap: 8
						}}
					>
						<Swing size={28} color={Colors.primary} />
						<Text
							style={{
								fontFamily: 'Outfit',
								fontWeight: 500
							}}
						>
							Saving changes...
						</Text>
					</View>
				</Modal>
			</Portal>
		</View>
	);
}
