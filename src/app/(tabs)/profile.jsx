import Colors from '@/constants/Colors';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useRef, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import ProfileView from '@/components/profile/ProfileView';
import SettingsView from '@/components/profile/SettingsView';
import SingleSidedShadow from '@/components/SingleSidedShadow';

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
			<SingleSidedShadow hasDefaultStyle={true}>
				<View
					style={{
						backgroundColor: Colors.backgroundColor,
						flexDirection: 'row',
						borderBottomStartRadius: 16,
						borderBottomEndRadius: 16,

						shadowColor: '#000',
						shadowOffset: { width: 1, height: 1 },
						shadowOpacity: 0.4,
						shadowRadius: 3,
						elevation: 8
					}}
				>
					<TouchableOpacity style={STYLES.container} onPress={handlePress(0)}>
						<Animated.Text
							style={[STYLES.buttonText, activeTab === 0 && STYLES.buttonActiveText]}
						>
							Profile
						</Animated.Text>
						{activeTab === 0 && <ActiveIndicator />}
					</TouchableOpacity>

					<TouchableOpacity style={STYLES.container} onPress={handlePress(1)}>
						<Animated.Text
							style={[STYLES.buttonText, activeTab === 1 && STYLES.buttonActiveText]}
						>
							Settings
						</Animated.Text>

						{activeTab === 1 && <ActiveIndicator />}
					</TouchableOpacity>
				</View>
			</SingleSidedShadow>

			<ScrollView
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
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
				backgroundColor: Colors.primary,
				height: 3,
				width: '50%',
				marginTop: 15,
				borderTopStartRadius: 100,
				borderTopEndRadius: 100
			}}
		/>
	);
}

const STYLES = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
		alignItems: 'center'
	},

	buttonText: {
		fontFamily: 'Outfit',
		fontSize: 16,
		fontWeight: 500,
		color: Colors.textColor,
		transitionDuration: 150
	},

	buttonActiveText: {
		color: Colors.primary
	}
});
