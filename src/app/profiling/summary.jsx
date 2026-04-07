import Animated, { FadeIn, useAnimatedRef } from 'react-native-reanimated';
import ProfileBottomSheet from '@/components/EditBottomSheet';
import { useCallback, useRef, useState } from 'react';
import SummaryCard from '@/components/EditCard';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import Colors from '@/constants/Colors';
import { Check } from 'lucide-react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/IconTheme';
import { doc, getFirestore, updateDoc } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';

const db = getFirestore();

export default function ProfilingSummary() {
	const scrollViewRef = useAnimatedRef();
	const profileSheetModalRef = useRef(null);
	const { bottom, top } = useSafeAreaInsets();
	const [selectedSection, setSelectedSection] = useState('');
	const profileData = useProfilingStore((state) => state.profile);
	const updateProfile = useProfilingStore((state) => state.setProfile);

	const router = useRouter();

	const handlePresentModalPress = useCallback(
		(section) => () => {
			setSelectedSection(section);
			profileSheetModalRef.current?.present();
		},
		[]
	);

	const handleUpdateProfile = (key, value) => () => {
		updateProfile(selectedSection, key, value);
	};

	const confirmButtonMargin = 10;
	const ConfirmButton = () => (
		<Animated.View entering={FadeIn.duration(200).delay(800)}>
			<PrimaryButton
				styles={{
					columnGap: 8
				}}
				containerStyle={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					marginHorizontal: 20,
					borderRadius: 100,
					marginBottom: bottom + confirmButtonMargin
				}}
				handlePress={async () => {
					await updateDoc(doc(db, 'users', auth.currentUser.uid), {
						profiling: profileData
					});
					router.dismissAll();
					router.replace('(tabs)');
				}}
			>
				<View
					style={{
						backgroundColor: '#fff',
						paddingHorizontal: 4,
						paddingVertical: 4,
						borderRadius: 100
					}}
				>
					<Check color={Colors.primary} size={14} strokeWidth={4} />
				</View>

				<Text style={{ color: '#FFF', fontWeight: '600' }}>Confirm and Save Profile</Text>
			</PrimaryButton>
		</Animated.View>
	);

	return (
		<>
			<Animated.ScrollView
				entering={FadeIn}
				ref={scrollViewRef}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: bottom + confirmButtonMargin + 80,
					padding: 20,
					rowGap: 16
				}}
			>
				<View
					style={{
						paddingTop: top,
						alignItems: 'center'
					}}
				>
					<Text
						style={{
							fontSize: 30,
							fontWeight: '800'
						}}
					>
						Final Review!
					</Text>
					<Text
						style={{
							color: '#aaaaaa',
							fontSize: 12,
							fontWeight: '350'
						}}
					>
						Almost there! Does this look right?
					</Text>
				</View>

				{Object.keys(profileData).map((section, index) => (
					<SummaryCard
						profileData={profileData}
						label={formatSnakeToTitle(section)}
						section={section}
						key={section}
						sectionValue={Object.entries(profileData[section])}
						handlePresentModalPress={handlePresentModalPress}
						iconProp={icons[index].icon(20, Colors.primary)}
						iconColor={Colors.primary}
					/>
				))}

				<ProfileBottomSheet
					profileData={profileData}
					editSheetModalRef={profileSheetModalRef}
					selectedSection={selectedSection}
					setSelectedSection={setSelectedSection}
					handleUpdateProfile={handleUpdateProfile}
				/>

				<View
					style={{
						backgroundColor: '#e8f5e9',
						padding: 16,
						borderRadius: 16,
						marginTop: 18
					}}
				>
					<Text style={{ color: Colors.textColor }}>
						<Text style={{ fontWeight: 700 }}>Reminder: </Text>All hair profiling
						questions are for general cosmetic ingredient matching and not for diagnosing
						scalp conditions like alopecia or clinical dandruff.
					</Text>
				</View>
			</Animated.ScrollView>

			<ConfirmButton />
		</>
	);
}
