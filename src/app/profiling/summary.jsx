import Animated, { FadeIn } from 'react-native-reanimated';

import ProfileBottomSheet from '@/components/profiling/ProfileBottomSheet';

import { useCallback, useRef, useState } from 'react';
import SummaryCard from '@/components/profiling/SummaryCard';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import formatSnakeToTitle from '@/utility/formatSnaketoTitle';
import Colors from '@/constants/Colors';
import { Check } from 'lucide-react-native';

import PrimaryButton from '@/components/PrimaryButton';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { icons } from '@/constants/IconTheme';

export default function ProfilingSummary() {
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
				handlePress={() => {
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
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: bottom + confirmButtonMargin + 80,
					padding: 20,
					rowGap: 16
				}}
				overScrollMode={'never'}
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
						iconProp={icons[index].icon(20)}
						iconColor={icons[index].color}
					/>
				))}

				<ProfileBottomSheet
					profileData={profileData}
					profileSheetModalRef={profileSheetModalRef}
					selectedSection={selectedSection}
					setSelectedSection={setSelectedSection}
					handleUpdateProfile={handleUpdateProfile}
				/>
			</Animated.ScrollView>

			<ConfirmButton />
		</>
	);
}
