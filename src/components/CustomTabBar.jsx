import { useLinkBuilder } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Scan } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

export default function CustomTabBar({ state, descriptors, navigation, iconProp }) {
	const { buildHref } = useLinkBuilder();
	const { bottom } = useSafeAreaInsets();
	const router = useRouter();

	const renderTabItem = (route, index) => {
		const { options } = descriptors[route.key];
		const label =
			options.tabBarLabel !== undefined
				? options.tabBarLabel
				: options.title !== undefined
					? options.title
					: route.name;

		const isFocused = state.index === index;

		const onPress = () => {
			const event = navigation.emit({
				type: 'tabPress',
				target: route.key,
				canPreventDefault: true
			});

			if (!isFocused && !event.defaultPrevented) {
				navigation.navigate(route.name, route.params);
			}
		};

		const activeColor =
			route.name === 'learn' || route.name === 'profile' ? '#ffb9ca' : Colors.primary;

		const onLongPress = () => {
			navigation.emit({
				type: 'tabLongPress',
				target: route.key
			});
		};

		return (
			<Pressable
				key={route.key}
				href={buildHref(route.name, route.params)}
				aria-label={options.tabBarAccessibilityLabel}
				aria-selected={isFocused}
				testID={options.tabBarButtonTestID}
				onPress={onPress}
				onLongPress={onLongPress}
				style={{
					flex: 1,

					paddingBottom: 14,
					alignItems: 'center',
					marginRight: label.toLowerCase() === 'history' && '20%'
				}}
			>
				<View style={{ display: 'flex', alignItems: 'center' }}>
					<ActiveIndicator isFocused={isFocused} activeColor={activeColor} />

					{options.iconProp(isFocused, activeColor)}
					<Animated.Text
						style={{
							color: isFocused ? activeColor : '#bcbcbe',
							transitionDuration: 130,
							fontWeight: isFocused ? 800 : 600,
							fontSize: 12
						}}
					>
						{label}
					</Animated.Text>
				</View>
			</Pressable>
		);
	};

	const ScannerButton = () => (
		<View style={{ position: 'absolute', width: '100%', bottom: 65 }}>
			<Pressable
				key='scanner-button'
				onPress={() => router.push('/scanner')}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					paddingHorizontal: 10
				}}
			>
				<View>
					<LinearGradient
						start={{ x: 0.3, y: 0.7 }}
						end={{ x: 1, y: 0.2 }}
						colors={['#b8a4f5', '#ffb9ca']}
						style={{
							padding: 16,
							borderRadius: 40,
							shadowColor: '#252524',
							shadowOffset: {
								width: 0,
								height: 1
							},
							shadowOpacity: 0.8,
							shadowRadius: 2.22,

							elevation: 3
						}}
					>
						<Scan color='#fffefe' size={28} />
					</LinearGradient>
				</View>
			</Pressable>
		</View>
	);

	const tabItems = [];

	state.routes.forEach((route, index) => {
		tabItems.push(renderTabItem(route, index));
	});

	return (
		<View
			style={{
				flexDirection: 'row',
				paddingBottom: bottom,
				backgroundColor: Colors.backgroundColor
			}}
		>
			<ScannerButton />
			{tabItems}
		</View>
	);
}

function ActiveIndicator({ isFocused, activeColor }) {
	return (
		<Animated.View
			style={[
				{
					backgroundColor: activeColor,
					height: 4,
					width: 50,

					borderRadius: 1.5,
					marginBottom: 8,
					opacity: isFocused ? 1 : 0,
					transitionDuration: 120
				}
			]}
		/>
	);
}
