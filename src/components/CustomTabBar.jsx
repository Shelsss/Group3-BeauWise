import { useLinkBuilder } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Scan } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
					<ActiveIndicator isFocused={isFocused} />

					{options.iconProp(isFocused)}
					<Animated.Text
						style={{
							color: isFocused ? '#a78bfa' : '#bcbcbe',
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
				<View
					style={{
						width: 56,
						height: 56,
						borderRadius: 50,
						alignItems: 'center',
						justifyContent: 'center',
						shadowColor: '#373535',
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 190,
						elevation: 8
					}}
				>
					<LinearGradient
						start={{ x: 0.2, y: 0.5 }}
						end={{ x: 1, y: 0 }}
						colors={['#b8a4f5', '#ffafbb']}
						style={{ padding: 15, borderRadius: 50 }}
					>
						<Scan color='#fffefe' size={25} />
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
				backgroundColor: '#ffffff'
			}}
		>
			<ScannerButton />
			{tabItems}
		</View>
	);
}

function ActiveIndicator({ isFocused }) {
	return (
		<Animated.View
			style={[
				{
					backgroundColor: '#a78bfa',
					height: 4,
					width: 50,
					transform: [{ scaleX: isFocused ? 1 : 0.5 }],
					borderRadius: 2,
					marginBottom: 8,
					opacity: isFocused ? 1 : 0,
					transitionDuration: 130
				}
			]}
		/>
	);
}
