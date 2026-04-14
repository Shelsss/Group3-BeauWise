import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { View, Text } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import EditBottomSheet from '@/components/EditBottomSheet';
import EditCard from '@/components/EditCard';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import { useRef, useState } from 'react';
import { icons } from '@/constants/IconTheme';

import { useAuthStore } from '@/stores/useAuthStore';
import GuessModeView from './GuessModeView';
import {
	doc,
	getDoc,
	getFirestore,
	query,
	updateDoc
} from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { UserRound } from 'lucide-react-native';

const db = getFirestore();

const fetchData = async () => {
	const queryOption = query(doc(db, 'users', auth.currentUser.uid));

	const documentSnapshot = await getDoc(queryOption);

	return documentSnapshot.data();
};

export default function ProfileView({ isVisible }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const editSheetModalRef = useRef(null);
	const [selectedSection, setSelectedSection] = useState('');
	const profileData = useProfilingStore((state) => state.profile);

	const { data, refetch } = useQuery({
		queryKey: [auth.currentUser?.uid],
		queryFn: fetchData,
		enabled: !!isAuthenticated,
		onError: (error) => {
			console.log('Error fetching profile data:', error);
		}
	});

	const handlePresentModalPress = (section) => () => {
		setSelectedSection(section);
		editSheetModalRef.current?.present();
	};

	const handleUpdateProfile = (key, value) => async () => {
		await updateDoc(doc(db, 'users', auth.currentUser?.uid), {
			[`profiling.${selectedSection}.${key}`]: value
		});

		refetch({
			throwOnError: true
		});
	};

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: PagePadding.config.paddingHorizontal,
				rowGap: 25,
				paddingTop: PagePadding.config.paddingTop + 10,
				paddingBottom: PagePadding.config.paddingBottom,
				zIndex: -999,
				display: isVisible ? 'flex' : 'none'
			}}
		>
			{!isAuthenticated && <GuessModeView />}

			{isAuthenticated && (
				<>
					<Shadow distance={1} stretch={true} startColor='#0000002a' offset={[0, 0.5]}>
						<View
							style={{
								padding: 24,
								backgroundColor: Colors.backgroundColor,
								borderRadius: 16,
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

							<Text style={{ fontSize: 20, fontWeight: 600, color: Colors.textColor }}>
								{auth?.currentUser?.displayName}
							</Text>
							<Text style={{ fontSize: 14, color: Colors.textColor + '7a' }}>
								{auth?.currentUser?.email}
							</Text>
						</View>
					</Shadow>

					{data?.profiling &&
						Object.keys(profileData).map((section, index) => (
							<EditCard
								profileData={profileData}
								label={formatSnakeToTitle(section)}
								section={section}
								key={section}
								sectionValue={Object.entries(data?.profiling[section])}
								handlePresentModalPress={handlePresentModalPress}
								iconProp={icons[index].icon(20, Colors.primary)}
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
					<Text style={{ fontWeight: 600, color: Colors.textColor }}>Profile Notice</Text>
					<Text
						style={{
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

			{data?.profiling && (
				<EditBottomSheet
					profileData={data?.profiling}
					editSheetModalRef={editSheetModalRef}
					selectedSection={selectedSection}
					setSelectedSection={setSelectedSection}
					handleUpdateProfile={handleUpdateProfile}
				/>
			)}
		</View>
	);
}
