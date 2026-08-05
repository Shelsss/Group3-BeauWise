import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRef, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import ProfileView from '@/components/profile/ProfileView';
import SettingsView from '@/components/profile/SettingsView';
import styles from '@/config/styles';

export default function ProfileScreen() {
	const scrollViewRef = useRef(null);
	const [activeTab, setActiveTab] = useState(0);

	const handlePress = (value) => () => {
		setActiveTab(value);
		resetScroll();
	};

	const resetScroll = () => {
		scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
	};

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingTop: 78.4,
					paddingBottom: styles.spacing.double_xxl,
					flexDirection: 'row'
				}}
			>
				<TouchableOpacity style={STYLES.container} onPress={handlePress(0)}>
					<Animated.Text style={[STYLES.buttonText]}>Profile</Animated.Text>
					{activeTab === 0 && <ActiveIndicator />}
				</TouchableOpacity>

				<TouchableOpacity style={STYLES.container} onPress={handlePress(1)}>
					<Animated.Text style={[STYLES.buttonText]}>Settings</Animated.Text>

					{activeTab === 1 && <ActiveIndicator />}
				</TouchableOpacity>
			</View>

			<ScrollView
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				contentContainerStyle={{
					paddingBottom: 80
				}}
			>
				<ProfileView key={'profile-view'} isVisible={activeTab === 0} />
				<SettingsView key={'settings-view'} isVisible={activeTab === 1} />
			</ScrollView>
		</View>
	);
}

function ActiveIndicator() {
	return (
		<Animated.View
			entering={FadeIn}
			style={{
				position: 'absolute',
				bottom: -16,
				backgroundColor: styles.background_color._04,
				height: 4,
				width: '38%',
				borderRadius: 1.2
			}}
		/>
	);
}

const STYLES = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},

	buttonText: {
		fontFamily: styles.font.family,
		fontSize: styles.font.size.lg,
		fontWeight: styles.font.weight.semi_bold,
		color: styles.font.colors._04
	}
});
