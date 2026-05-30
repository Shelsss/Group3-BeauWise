import { useLinkBuilder } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Focus } from 'lucide-react-native';
import { Pressable, View, Vibration, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { Shadow } from 'react-native-shadow-2';

export default function CustomTabBar({ state, descriptors, navigation, onTabPress }) {
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
				if (onTabPress) {
					onTabPress(route.name);
				} else {
					navigation.navigate(route.name, route.params);
				}
			}
		};

		if (isFocused) {
			Vibration.vibrate(50);
		}

		const onLongPress = () => {
			navigation.emit({
				type: 'tabLongPress',
				target: route.key
			});
		};

		return (
			<TouchableOpacity
				activeOpacity={0.5}
				key={route.key}
				href={buildHref(route.name, route.params)}
				aria-label={options.tabBarAccessibilityLabel}
				aria-selected={isFocused}
				testID={options.tabBarButtonTestID}
				onPress={onPress}
				onLongPress={onLongPress}
				style={{
					flex: 1,
					paddingTop: 15,
					paddingBottom: bottom,
					alignItems: 'center',
					marginRight: label === 'History' && '20%'
				}}
			>
				<View style={{ display: 'flex', alignItems: 'center' }}>
					{options.iconProp(isFocused, Colors.primary)}

					<Animated.Text
						style={{
							marginTop: 2,
							color: isFocused ? Colors.primary : '#000000a6',
							fontWeight: 900,
							fontSize: 10,
							opacity: isFocused ? 1 : 0,

							transform: [
								{
									translateY: isFocused ? 0 : 5
								}
							],
							transitionDuration: 150
						}}
					>
						{label}
					</Animated.Text>
				</View>
			</TouchableOpacity>
		);
	};

	const ScannerButton = () => (
		<View
			style={{
				position: 'absolute',
				width: '100%',
				bottom: '55%',

				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				key='scanner-button'
				onPress={() => router.push('scanner')}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: Colors.backgroundColor,
					paddingTop: 5,
					paddingLeft: 5,
					paddingRight: 5,
					borderRadius: 100
				}}
			>
				<View
					style={{
						padding: 16,
						borderRadius: 40,

						backgroundColor: Colors.primary
					}}
				>
					<Focus color='#fffefe' size={28} />
				</View>
			</TouchableOpacity>
		</View>
	);

	const tabItems = [];

	state.routes.forEach((route, index) => {
		tabItems.push(renderTabItem(route, index));
	});

	return (
		<View
			style={{
				backgroundColor: 'transparent'
				// position: 'absolute',
				// bottom: 0,
				// left: 0,
				// right: 0
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					backgroundColor: Colors.backgroundColor
				}}
			>
				<ScannerButton />
				{tabItems}
			</View>
		</View>
	);
}
