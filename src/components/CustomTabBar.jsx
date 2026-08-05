import { useLinkBuilder } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Focus } from 'lucide-react-native';
import { View, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import AiScan from './icons/hugeicons/AiScan';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 110;
const MOUNTAIN_WIDTH = 80;
const MOUNTAIN_HEIGHT = 16;

const getTabPath = () => {
	const center = SCREEN_WIDTH / 2;
	const curveStart = center - MOUNTAIN_WIDTH / 2;
	const curveEnd = center + MOUNTAIN_WIDTH / 2;

	return `
        M 0 ${MOUNTAIN_HEIGHT}
        L ${curveStart} ${MOUNTAIN_HEIGHT}
        C ${curveStart + 15} ${MOUNTAIN_HEIGHT}, ${center - 25} 0, ${center} 0
        C ${center + 25} 0, ${curveEnd - 15} ${MOUNTAIN_HEIGHT}, ${curveEnd} ${MOUNTAIN_HEIGHT}
        L ${SCREEN_WIDTH} ${MOUNTAIN_HEIGHT}
        L ${SCREEN_WIDTH} ${TAB_BAR_HEIGHT}
        L 0 ${TAB_BAR_HEIGHT}
        Z
    `;
};

export default function CustomTabBar({ state, descriptors, navigation, onTabPress }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
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
					{options.iconProp(
						isFocused,
						styles.theme.colors.primary,
						styles.theme.colors[activeTheme].icon + '7a'
					)}

					<Animated.Text
						style={{
							marginTop: 2,
							color: isFocused
								? styles.theme.colors.primary
								: styles.theme.colors[activeTheme].text + '7a',
							fontWeight: styles.font.weight.bold,
							fontSize: styles.font.size.xs,

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
				top: 8,
				left: 0,
				right: 0,
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				key='scanner-button'
				onPress={() => router.push('scanner/initial_page')}
				style={{
					padding: 16,
					borderRadius: 40,
					backgroundColor: Colors.primary,

					...styles.shadow.md
				}}
			>
				<AiScan color='#fffefe' size={styles.icon.size.xl} />
			</TouchableOpacity>
		</View>
	);

	const tabItems = [];

	state.routes.forEach((route, index) => {
		tabItems.push(renderTabItem(route, index));
	});

	return (
		<View
			style={{ height: TAB_BAR_HEIGHT, position: 'absolute', width: '100%', bottom: 0 }}
		>
			<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
				<Svg width={SCREEN_WIDTH} height={TAB_BAR_HEIGHT}>
					<Path
						d={getTabPath()}
						fill={styles.theme.colors[activeTheme].card_background}
						stroke={styles.theme.colors[activeTheme].card_border}
						strokeWidth={0.8}
					/>
				</Svg>
			</View>

			<ScannerButton />

			<View
				style={{
					flexDirection: 'row',
					flex: 1,

					paddingTop: MOUNTAIN_HEIGHT
				}}
			>
				{tabItems}
			</View>
		</View>
	);
}
