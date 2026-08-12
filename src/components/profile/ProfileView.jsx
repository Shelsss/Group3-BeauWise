import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { useProfilingStore } from '@/stores/useProfilingStore';
import {
	View,
	Text,
	TouchableOpacity,
	useColorScheme,
	ScrollView,
	RefreshControl
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import EditBottomSheet from '@/components/EditBottomSheet';
import EditCard from '@/components/EditCard';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import { useEffect, useRef, useState } from 'react';
import { icons } from '@/constants/IconTheme';

import { useAuthStore } from '@/stores/useAuthStore';
import GuessModeView from './GuessModeView';
import { doc, getDoc, query, setDoc } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { UserRound } from 'lucide-react-native';
import { Swing } from 'react-native-animated-spinkit';
import Retry from '../Retry';
import { Modal, Portal } from 'react-native-paper';
import Warn from '../icons/hugeicons/Warn';
import Questions from '@/constants/Questionnaire';
import Toast from 'react-native-toast-message';
import { db } from '@/services/firestore';
import User from '../icons/hugeicons/User';
import Profile from '../icons/hugeicons/Profile';
import Profile2 from '../icons/hugeicons/Profile2';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';
import Profile2Solid from '../icons/hugeicons/Profile2Solid';
import { storage } from '@/config/mmkv';
import Skeleton from '../Skeleton';
import RetryError from '../RetryError';
import { onScroll } from '@/utility/scrollView';

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

	const foo = Questions.find((item) => item.section === section)
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
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const editSheetModalRef = useRef(null);
	const [selectedSection, setSelectedSection] = useState('');
	const profileData = useProfilingStore((state) => state.profile);
	const updateProfile = useProfilingStore((state) => state.setProfile);
	const populateProfile = useProfilingStore((state) => state.populateProfile);
	const isProfilingComplete = storage.getBoolean('isProfilingComplete');

	const scrollRef = useRef(null);
	const [unSaveChanges, setUnSaveChanges] = useState({});

	const [visible, setVisible] = useState(false);
	const [staleProfilingData, setStaleProfilingData] = useState({});

	const showModal = () => setVisible(true);
	const closeModal = () => setVisible(false);

	const { data, refetch, isFetching, isError, isRefetchError, isRefetching, isSuccess } =
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
				bottomOffset: 120,
				position: 'bottom',
				props: {
					activeTheme
				}
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
				bottomOffset: 120,
				position: 'bottom',
				props: {
					activeTheme
				}
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

	const onEdit = (section) => () => {
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
		<>
			<ScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				refreshControl={
					isAuthenticated ? (
						<RefreshControl
							refreshing={isFetching}
							onRefresh={retry}
							progressBackgroundColor={styles.theme.colors[activeTheme].card_background}
							colors={[styles.theme.colors.primary]}
						/>
					) : null
				}
				onScroll={onScroll(scrollRef)}
				contentContainerStyle={{
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
						<RetryError refetch={refetch} />
					</View>
				)}

				{!isAuthenticated && <GuessModeView />}
				{isFetching && isAuthenticated ? (
					<>
						<Skeleton
							width={'100%'}
							height={160}
							borderRadius={styles.border.radius.size.md}
						/>

						<View style={{ rowGap: styles.spacing.xxl }}>
							{[...Array(7)].map((_, index) => (
								<Skeleton
									key={index}
									width={'100%'}
									height={12}
									borderRadius={styles.border.radius.size.sm}
								/>
							))}
						</View>
					</>
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
										backgroundColor: styles.theme.colors[activeTheme].card_background,
										borderRadius: styles.border.radius.size.sm,
										borderWidth: 1,
										borderColor: styles.theme.colors[activeTheme].card_border,
										alignItems: 'center'
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
												backgroundColor: styles.theme.colors[activeTheme].card_background,
												borderWidth: 1,
												borderColor: styles.theme.colors[activeTheme].card_border,
												padding: 16,
												borderRadius: styles.border.radius.size.pill,
												marginBottom: 16,
												overflow: 'hidden'
											}}
										>
											<Profile2Solid size={28} color={Colors.primary} />
										</View>
									)}

									<Text
										style={{
											fontFamily: styles.font.family,

											fontWeight: styles.font.weight.bold,
											fontSize: styles.font.size.lg,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{auth?.currentUser?.displayName}
									</Text>
									<Text
										style={{
											fontSize: styles.font.size.md,
											color: styles.theme.colors[activeTheme].text_secondary,
											fontFamily: styles.font.family
										}}
									>
										{auth?.currentUser?.email}
									</Text>
								</View>

								<View>
									<Text
										style={{
											color: styles.theme.colors[activeTheme].text,
											marginTop: styles.spacing.xxl,
											fontFamily: styles.font.family,
											textAlign: 'center',
											fontWeight: styles.font.weight.bold
										}}
									>
										Profiling
									</Text>
								</View>
								{data?.profiling &&
									Object.keys(profileData).map((section, index) => (
										<EditCard
											activeTheme={activeTheme}
											profileData={profileData}
											label={formatSnakeToTitle(section)}
											questions={Questions}
											section={section}
											key={section}
											onEdit={onEdit(section)}
											iconProp={getIcon(section)}
										/>
									))}
							</>
						)}
					</View>
				)}
			</ScrollView>

			{data?.profiling && (
				<EditBottomSheet
					activeTheme={activeTheme}
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
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							padding: 16,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<Warn color='#ff7a7c' size={40} />

						<View>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									textAlign: 'center',
									fontSize: styles.font.size.lg,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Hang on a second.
							</Text>

							<Text
								style={{
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									textAlign: 'center',
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text_secondary
								}}
							>
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
								<Text
									style={{
										fontFamily: styles.font.family,
										color: '#ff7a7c',
										fontSize: styles.font.size.md
									}}
								>
									Discard
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={closeModal}
								activeOpacity={0.7}
								style={{
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].card_border,
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									paddingVertical: 14,
									paddingHorizontal: 16,
									borderRadius: 8
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text,
										fontSize: styles.font.size.md
									}}
								>
									Keep Editing
								</Text>
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
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							alignItems: 'center',
							rowGap: 8
						}}
					>
						<Swing size={styles.icon.size.xl} color={styles.theme.colors.primary} />
						<Text
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.light,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Saving changes...
						</Text>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
