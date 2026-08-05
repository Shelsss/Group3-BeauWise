import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import PageFour from '@/components/onboarding/PageFour';
import PageOne from '@/components/onboarding/PageOne';
import PageTwo from '@/components/onboarding/PageTwo';
import { storage } from '@/config/mmkv';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/useThemeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
	useColorScheme,
	BackHandler,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import { usePagerView } from 'react-native-pager-view';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const pages = [
	{
		title: 'Analyze cosmetic ingredients with confidence',
		description:
			'Scan products, verify information, and understand ingredients that match your needs.',
		animatedComponent: ({ isActive }) => <PageOne isActive={isActive} />
	},

	{
		title: 'Know what works for you',
		description:
			'See ingredients that may match your profile and identify ingredients that may need attention before using a product.',
		animatedComponent: ({ isActive }) => <PageTwo isActive={isActive} />
	},

	{
		title: 'Make informed cosmetic choices',
		description:
			'Verify product information, explore ingredient insights, and access evidence-based tools designed to help you understand cosmetic products better.',
		animatedComponent: ({ isActive }) => <PageFour isActive={isActive} />
	}
];

const PaginationDot = ({ index, currentIndex }) => {
	const animatedStyle = useAnimatedStyle(() => {
		const isActive = index === currentIndex;
		return {
			width: withTiming(isActive ? 20 : 6, { duration: 160 }),

			backgroundColor: withTiming(isActive ? styles.theme.colors.primary : '#e7e6e6', {
				duration: 100
			})
		};
	});

	return (
		<Animated.View
			style={[
				{
					height: 6,
					borderRadius: 50
				},
				animatedStyle
			]}
		/>
	);
};

const Page = ({ currentIndex, index, title, description, render = null }) => {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	return (
		<View style={[STYLES.page]} key={index}>
			<Text
				style={{
					textAlign: 'center',
					fontFamily: styles.font.family,
					fontSize: styles.font.size.xxl,
					color: styles.theme.colors.primary,
					fontWeight: styles.font.weight.bold
				}}
			>
				{title}
			</Text>

			{render && render({ isActive: currentIndex === index })}

			<View>
				<Text
					style={{
						textAlign: 'center',
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text,

						lineHeight: 20
					}}
				>
					{description}
				</Text>
			</View>
		</View>
	);
};

export default function OnboardingPager() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const { bottom, top } = useSafeAreaInsets();
	const { setPage, PagerView, ref } = usePagerView();
	const [pageNumber, setPageNumber] = useState(0);

	const handleNextPage = (newPage) => async () => {
		if (newPage >= pages.length) {
			router.replace('authentication/sign-in');
			onFinish();

			return;
		}

		setPage(newPage);
		setPageNumber(newPage);
	};

	const handlePreviousPage = () => {
		if (pageNumber > 0) {
			let page = pageNumber - 1;
			setPage(page);
			setPageNumber(page);
		} else {
			router.back();
		}
	};

	const handleSkip = async () => {
		if (router.canGoBack()) {
			router.dismissAll();
		}
		onFinish();
		router.replace('authentication/sign-in');
	};

	const onFinish = () => {
		storage.set('isOnboardComplete', true);
	};

	useEffect(() => {
		const backAction = () => {
			if (pageNumber > 0) {
				let page = pageNumber - 1;
				setPage(page);
				setPageNumber(page);
				return true;
			}

			return false;
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [pageNumber]);

	return (
		<>
			<View
				style={{
					position: 'absolute',
					zIndex: 2,
					top: 20,
					flexDirection: 'row',

					width: '100%',
					paddingTop: top
				}}
			>
				{(router.canGoBack() || pageNumber > 0) && (
					<TouchableOpacity onPress={handlePreviousPage} style={{ marginLeft: 16 }}>
						<ChevronLeft color={styles.theme.colors[activeTheme].icon} />
					</TouchableOpacity>
				)}

				{pageNumber < pages.length - 1 && (
					<TouchableOpacity
						style={{ marginLeft: 'auto', marginRight: 20 }}
						onPress={handleSkip}
					>
						<Text style={{ fontFamily: 'Outfit', color: Colors.primary }}>Skip</Text>
					</TouchableOpacity>
				)}
			</View>
			<PagerView
				onPageSelected={({ nativeEvent: { position } }) =>
					handleNextPage(position).call()
				}
				ref={ref}
				style={STYLES.pagerView}
				initialPage={pageNumber}
			>
				{pages.map((page, index) => (
					<Page
						render={page.animatedComponent}
						title={page.title}
						description={page.description}
						index={index}
						currentIndex={pageNumber}
						key={index}
					/>
				))}
			</PagerView>

			<View
				style={{ marginBottom: bottom + 10, marginHorizontal: 16, position: 'relative' }}
			>
				<View
					style={{
						alignSelf: 'center',
						position: 'absolute',
						top: -40,
						flexDirection: 'row',
						columnGap: 6
					}}
				>
					{pages.map((_, index) => (
						<PaginationDot index={index} currentIndex={pageNumber} key={index} />
					))}
				</View>
				<TouchableOpacity
					onPress={handleNextPage(pageNumber + 1)}
					activeOpacity={0.7}
					style={{
						backgroundColor: Colors.primary,
						borderRadius: 10,
						paddingVertical: 14,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						columnGap: 2
					}}
				>
					<Text
						style={{
							color: '#fff',
							fontFamily: 'Outfit',
							fontSize: 14,
							fontWeight: 500,
							marginBottom: 'auto'
						}}
					>
						Continue
					</Text>

					<ArrowRight size={16} color='#fff' />
				</TouchableOpacity>
			</View>
		</>
	);
}

const STYLES = StyleSheet.create({
	pagerView: {
		flex: 1,
		marginHorizontal: 16,
		justifyContent: 'center'
	},

	page: {
		rowGap: 90,
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	}
});
