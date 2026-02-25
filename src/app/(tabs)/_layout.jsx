import { BookOpen, Clock9, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { MaterialTopTabs } from '../../components/MaterialTopTabs';

export default function TopTabsLayout() {
	return (
		<MaterialTopTabs
			tabBar={(props) => <CustomTabBar {...props} />}
			backBehavior='fullHistory'
			tabBarPosition='bottom'
		>
			<MaterialTopTabs.Screen
				name='index'
				options={{
					title: 'Home',
					iconProp: TabBarIcon(House),
					tabBarButtonTestID: 'home-tab',
					tabBarAccessibilityLabel: 'Home Tab'
				}}
			/>
			<MaterialTopTabs.Screen
				name='history'
				options={{
					title: 'History',
					iconProp: TabBarIcon(Clock9),
					tabBarButtonTestID: 'history-tab',
					tabBarAccessibilityLabel: 'History Tab'
				}}
			/>
			<MaterialTopTabs.Screen
				name='learn'
				options={{
					title: 'Learn',
					iconProp: TabBarIcon(BookOpen),
					tabBarButtonTestID: 'learn-tab',
					tabBarAccessibilityLabel: 'Learn Tab'
				}}
			/>
			<MaterialTopTabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					iconProp: TabBarIcon(UserRound),
					tabBarButtonTestID: 'profile-tab',
					tabBarAccessibilityLabel: 'Profile Tab'
				}}
			/>
		</MaterialTopTabs>
	);
}

function TabBarIcon(IconNode) {
	return function iconProp(isFocused, activeColor) {
		return <IconNode size={20} color={isFocused ? activeColor : '#bcbcbe'} />;
	};
}
