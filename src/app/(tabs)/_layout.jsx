import { BookOpen, History, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { MaterialTopTabs } from '../../components/MaterialTopTabs';

export default function TopTabsLayout() {
	return (
		<MaterialTopTabs
			tabBar={(props) => <CustomTabBar {...props} />}
			backBehavior='fullHistory'
			tabBarPosition='bottom'
			screenOptions={{
				tabBarShowIcon: true,
				tabBarActiveTintColor: 'red'
			}}
		>
			<MaterialTopTabs.Screen
				name='index'
				options={{
					title: 'Home',
					iconProp: TabBarIcon(House)
				}}
			/>
			<MaterialTopTabs.Screen
				name='history'
				options={{ title: 'History', iconProp: TabBarIcon(History) }}
			/>
			<MaterialTopTabs.Screen
				name='learn'
				options={{ title: 'Learn', iconProp: TabBarIcon(BookOpen) }}
			/>
			<MaterialTopTabs.Screen
				name='profile'
				options={{ title: 'Profile', iconProp: TabBarIcon(UserRound) }}
			/>
		</MaterialTopTabs>
	);
}

function TabBarIcon(IconNode) {
	return function iconProp(isFocused) {
		return <IconNode size={20} color={isFocused ? '#a78bfa' : '#bcbcbe'} />;
	};
}
