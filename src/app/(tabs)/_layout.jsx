import { BookOpen, Clock9, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import CustomHeader from '@/components/CustomHeader';
import { SwipeableTabs } from '@/components/SwipeableTabs';

export default function TopTabsLayout() {
	return (
		<SwipeableTabs
			tabBar={(props) => <CustomTabBar {...props} />}
			backBehavior='initialRoute'
			screenOptions={{
				header: ({ options }) => <CustomHeader title={options.title} />,
				sceneStyle: {
					backgroundColor: '#f8fafc'
				}
			}}
		>
			<SwipeableTabs.Screen
				name='index'
				options={{
					title: 'Home',
					iconProp: TabBarIcon(House),
					tabBarButtonTestID: 'home-tab',
					tabBarAccessibilityLabel: 'Home Tab'
				}}
			/>
			<SwipeableTabs.Screen
				name='history'
				options={{
					title: 'History',
					iconProp: TabBarIcon(Clock9),
					tabBarButtonTestID: 'history-tab',
					tabBarAccessibilityLabel: 'History Tab'
				}}
			/>
			<SwipeableTabs.Screen
				name='learn'
				options={{
					title: 'Learn',
					iconProp: TabBarIcon(BookOpen),
					tabBarButtonTestID: 'learn-tab',
					tabBarAccessibilityLabel: 'Learn Tab'
				}}
			/>
			<SwipeableTabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					iconProp: TabBarIcon(UserRound),
					tabBarButtonTestID: 'profile-tab',
					tabBarAccessibilityLabel: 'Profile Tab'
				}}
			/>
		</SwipeableTabs>
	);
}

function TabBarIcon(IconNode) {
	return function iconProp(isFocused, activeColor) {
		return <IconNode size={20} color={isFocused ? activeColor : '#bcbcbe'} />;
	};
}
