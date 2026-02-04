import { BookOpen, Clock9, House, UserRound } from 'lucide-react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { MaterialTopTabs } from '../../components/MaterialTopTabs';
import Colors from '../../constants/Colors';

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
					iconProp: TabBarIcon(House)
				}}
			/>
			<MaterialTopTabs.Screen
				name='history'
				options={{ title: 'History', iconProp: TabBarIcon(Clock9) }}
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
	return function iconProp(isFocused, activeColor) {
		return <IconNode size={20} color={isFocused ? activeColor : '#bcbcbe'} />;
	};
}
