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

const profileSchema = {
	profileNickName: 'MD',
	name: 'Maria Dela Cruz',
	email: 'mariadelacruz@gmail.com'
};

export default function ProfileView({ isVisible }) {
	const editSheetModalRef = useRef(null);
	const [selectedSection, setSelectedSection] = useState('');
	const profileData = useProfilingStore((state) => state.profile);
	const updateProfile = useProfilingStore((state) => state.setProfile);

	const handlePresentModalPress = (section) => () => {
		setSelectedSection(section);
		editSheetModalRef.current?.present();
	};

	const handleUpdateProfile = (key, value) => () => {
		updateProfile(selectedSection, key, value);
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
			<Shadow distance={1} stretch={true} startColor='#0000002a' offset={[0, 0.5]}>
				<View
					style={{
						padding: 24,
						backgroundColor: Colors.backgroundColor,
						borderRadius: 16,
						alignItems: 'center'
					}}
				>
					<View
						style={{
							backgroundColor: Colors.primary + '1a',
							padding: 16,
							borderRadius: 100,
							marginBottom: 16
						}}
					>
						<Text style={{ fontSize: 24, color: Colors.primary }}>
							{profileSchema.profileNickName}
						</Text>
					</View>

					<Text style={{ fontSize: 20, fontWeight: 600, color: Colors.textColor }}>
						{profileSchema.name}
					</Text>
					<Text style={{ fontSize: 14, color: Colors.textColor + '7a' }}>
						{profileSchema.email}
					</Text>
				</View>
			</Shadow>

			{Object.keys(profileData).map((section, index) => (
				<EditCard
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

			<EditBottomSheet
				profileData={profileData}
				editSheetModalRef={editSheetModalRef}
				selectedSection={selectedSection}
				setSelectedSection={setSelectedSection}
				handleUpdateProfile={handleUpdateProfile}
			/>
		</View>
	);
}
