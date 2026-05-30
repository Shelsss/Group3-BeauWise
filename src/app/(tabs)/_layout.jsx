import { BookOpen, Clock9, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import CustomHeader from '@/components/CustomHeader';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const MaterialTopTabs = createMaterialTopTabNavigator();
const Tab = withLayoutContext(MaterialTopTabs.Navigator);

export default function TopTabsLayout() {
	return (
		<Tab
			tabBarPosition='bottom'
			tabBar={(props) => <CustomTabBar {...props} />}
			backBehavior='initialRoute'
			screenOptions={{
				header: ({ options }) => <CustomHeader title={options.title} />,
				sceneStyle: {
					backgroundColor: '#f8fafc'
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
					iconProp: TabBarIcon(House),
					tabBarButtonTestID: 'home-tab',
					tabBarAccessibilityLabel: 'Home Tab'
				}}
			/>
			<Tab.Screen
				name='history'
				options={{
					title: 'History',
					iconProp: TabBarIcon(Clock9),
					tabBarButtonTestID: 'history-tab',
					tabBarAccessibilityLabel: 'History Tab'
				}}
			/>
			<Tab.Screen
				name='learn'
				options={{
					title: 'Learn',
					iconProp: TabBarIcon(BookOpen),
					tabBarButtonTestID: 'learn-tab',
					tabBarAccessibilityLabel: 'Learn Tab'
				}}
			/>
			<Tab.Screen
				name='profile'
				options={{
					title: 'Profile',
					iconProp: TabBarIcon(UserRound),
					tabBarButtonTestID: 'profile-tab',
					tabBarAccessibilityLabel: 'Profile Tab'
				}}
			/>
		</Tab>
	);
}

function TabBarIcon(IconNode) {
	return function iconProp(isFocused, activeColor) {
		return <IconNode size={20} color={isFocused ? activeColor : '#bcbcbe'} />;
	};
}
