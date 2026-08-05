import { BookOpen, Clock9, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import CustomHeader from '@/components/CustomHeader';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';
import Home from '@/components/icons/hugeicons/Home';
import History from '@/components/icons/hugeicons/History';
import Learn from '@/components/icons/hugeicons/Learn';
import Profile from '@/components/icons/hugeicons/Profile';
import HomeSolid from '@/components/icons/hugeicons/HomeSolid';
import HistorySolid from '@/components/icons/hugeicons/HistorySolid';
import LearnSolid from '@/components/icons/hugeicons/LearnSolid';
import ProfileSolid from '@/components/icons/hugeicons/ProfileSolid';
import Profile2 from '@/components/icons/hugeicons/Profile2';
import Profile2Solid from '@/components/icons/hugeicons/Profile2Solid';

const MaterialTopTabs = createMaterialTopTabNavigator();
const Tab = withLayoutContext(MaterialTopTabs.Navigator);

export default function TopTabsLayout() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<Tab
			tabBarPosition='bottom'
			tabBar={(props) => <CustomTabBar {...props} />}
			backBehavior='initialRoute'
			screenOptions={{
				header: ({ options }) => <CustomHeader title={options.title} />,
				sceneStyle: {
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				},
				animationEnabled: false,
				lazy: true,
				lazyPreloadDistance: 0
			}}
		>
			<Tab.Screen
				name='index'
				options={{
					title: 'Home',
					iconProp: TabBarIcon(Home, HomeSolid),
					tabBarButtonTestID: 'home-tab',
					tabBarAccessibilityLabel: 'Home Tab'
				}}
			/>
			<Tab.Screen
				name='history'
				options={{
					title: 'History',
					iconProp: TabBarIcon(History, HistorySolid),
					tabBarButtonTestID: 'history-tab',
					tabBarAccessibilityLabel: 'History Tab'
				}}
			/>
			<Tab.Screen
				name='learn'
				options={{
					title: 'Learn',
					iconProp: TabBarIcon(Learn, LearnSolid),
					tabBarButtonTestID: 'learn-tab',
					tabBarAccessibilityLabel: 'Learn Tab'
				}}
			/>
			<Tab.Screen
				name='profile'
				options={{
					title: 'Profile',
					iconProp: TabBarIcon(Profile2, Profile2Solid),
					tabBarButtonTestID: 'profile-tab',
					tabBarAccessibilityLabel: 'Profile Tab'
				}}
			/>
		</Tab>
	);
}

function TabBarIcon(IconNode, IconSolidNode) {
	return function iconProp(isFocused, color, inActiveColor) {
		return isFocused ? (
			<IconSolidNode size={styles.icon.size.xl + 6} color={color} />
		) : (
			<IconNode size={styles.icon.size.xl + 6} color={inActiveColor} />
		);
	};
}
