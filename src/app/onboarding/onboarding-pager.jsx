import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import PageFour from '@/components/onboarding/PageFour';
import PageOne from '@/components/onboarding/PageOne';
import PageThree from '@/components/onboarding/PageThree';
import PageTwo from '@/components/onboarding/PageTwo';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePagerView } from 'react-native-pager-view';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-worklets-core';

const pages = [
	{
		title: 'Welcome to BeauWise',
		description:
			'Your smart companion for cosmetic ingredient analysis. We decode complex labels so you know exactly what goes on your skin and hair.',
		animatedComponent: ({ isActive }) => <PageOne isActive={isActive} />
	},

	{
		title: 'Decode Ingredients Instantly',
		description:
			'Snap a photo of any cosmetic label. Our scanner reads the text and cross-references the ingredients with established cosmetic literature and safety guidelines.',
		animatedComponent: ({ isActive }) => <PageTwo isActive={isActive} />
	},

	{
		title: 'Check Legitimacy & Freshness',
		description:
			'Verify if a product is FDA-notified to help avoid counterfeits. You can also use our batch code decoder to keep an eye on product freshness.',
		animatedComponent: ({ isActive }) => <PageThree isActive={isActive} />
	},

	{
		title: 'Build Your Cosmetic Literacy',
		description:
			'To provide a profile-based ingredient analysis and personalized educational suggestions, we need to understand your general skin and hair traits.',
		animatedComponent: ({ isActive }) => <PageFour isActive={isActive} />
	}
];

const PaginationDot = ({ index, currentIndex }) => {
	const animatedStyle = useAnimatedStyle(() => {
		const isActive = index === currentIndex;
		return {
			width: withTiming(isActive ? 20 : 6, { duration: 160 }),

			backgroundColor: withTiming(isActive ? Colors.primary : '#e7e6e6', {
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
	return (
		<View style={[styles.page]} key={index}>
			{render && render({ isActive: currentIndex === index })}

			<View style={{ rowGap: 6 }}>
				<Text
					style={{
						textAlign: 'center',
						fontFamily: 'Outfit',
						fontSize: 22,
						color: index === 0 ? Colors.primary : Colors.textColor,
						fontWeight: 600
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						textAlign: 'center',
						fontFamily: 'Outfit',
						color: Colors.textColor,
						width: 280,
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
	const { bottom, top } = useSafeAreaInsets();
	const { setPage, PagerView, ref } = usePagerView();
	const [pageNumber, setPageNumber] = useState(0);

	const handleNextPage = (newPage) => async () => {
		if (newPage >= pages.length) {
			router.dismissAll();
			router.replace('authentication/sign-in');
			await onFinish();

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
		await onFinish();
		router.dismissAll();
		router.replace('authentication/sign-in');
	};

	const onFinish = async () => {
		try {
			await AsyncStorage.setItem('isOnboardComplete', JSON.stringify(true));
		} catch (error) {
			console.log(error);
			console.log('is error');
		}
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
				<TouchableOpacity
					onPress={handlePreviousPage}
					style={{ marginLeft: 16, transform: [{ rotateZ: '180deg' }] }}
				>
					<ArrowRight />
				</TouchableOpacity>

				{pageNumber < pages.length - 1 && (
					<TouchableOpacity
						style={{ marginLeft: 'auto', marginRight: 20 }}
						onPress={handleSkip}
					>
						<Text style={{ fontFamily: 'Outfit', color: Colors.primary }}>SKIP</Text>
					</TouchableOpacity>
				)}
			</View>
			<PagerView
				onPageSelected={({ nativeEvent: { position } }) =>
					handleNextPage(position).call()
				}
				ref={ref}
				style={styles.pagerView}
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

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
		marginHorizontal: 16,
		justifyContent: 'center'
	},

	page: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	}
});
