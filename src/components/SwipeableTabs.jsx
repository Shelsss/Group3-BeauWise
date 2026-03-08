import { useRef, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence
} from 'react-native-reanimated';
import {
	createNavigatorFactory,
	useNavigationBuilder,
	TabRouter
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

function SwipeableTabView({ state, descriptors, navigation, tabBar, screenOptions }) {
	const pagerRef = useRef(null);
	const prevIndexRef = useRef(state.index);
	const isJumpingRef = useRef(false);
	const isTapNavigationRef = useRef(false);
	const opacity = useSharedValue(1);

	useEffect(() => {
		const targetIndex = state.index;
		const prevIndex = prevIndexRef.current;

		if (targetIndex === prevIndex) return;

		if (isTapNavigationRef.current) {
			const distance = Math.abs(targetIndex - prevIndex);
			if (distance > 1) {
				isJumpingRef.current = true;
			}
			pagerRef.current?.setPageWithoutAnimation(targetIndex);

			isTapNavigationRef.current = false;
		} else {
			const distance = Math.abs(targetIndex - prevIndex);
			if (distance > 1) {
				isJumpingRef.current = true;
				const adjacentIndex = targetIndex > prevIndex ? targetIndex - 1 : targetIndex + 1;
				pagerRef.current?.setPageWithoutAnimation(adjacentIndex);
				requestAnimationFrame(() => {
					pagerRef.current?.setPage(targetIndex);
				});
			} else {
				pagerRef.current?.setPage(targetIndex);
			}
		}

		prevIndexRef.current = targetIndex;
	}, [state.index, opacity]);

	const onPageSelected = useCallback(
		(e) => {
			const index = e.nativeEvent.position;

			if (isJumpingRef.current) {
				if (index === state.index) {
					isJumpingRef.current = false;
				}
				return;
			}

			if (isTapNavigationRef.current) return;

			const route = state.routes[index];
			if (route && state.index !== index) {
				navigation.navigate(route.name);
			}
		},
		[state.routes, state.index, navigation]
	);

	const handleTabPress = useCallback(
		(routeName) => {
			const targetIndex = state.routes.findIndex((r) => r.name === routeName);
			if (targetIndex !== -1 && targetIndex !== state.index) {
				isTapNavigationRef.current = true;
				navigation.navigate(routeName);
			}
		},
		[state.routes, state.index, navigation]
	);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value
	}));

	const activeRoute = state.routes[state.index];
	const activeDescriptor = descriptors[activeRoute.key];
	const headerOption = activeDescriptor.options.header || screenOptions?.header;

	return (
		<View style={{ flex: 1 }}>
			<Animated.View style={[{ flex: 1 }, animatedStyle]}>
				{headerOption && headerOption({ options: activeDescriptor.options })}
				<PagerView
					ref={pagerRef}
					style={{ flex: 1, zIndex: -20 }}
					initialPage={state.index}
					onPageSelected={onPageSelected}
					overScrollMode='never'
				>
					{state.routes.map((route) => (
						<View key={route.key} style={{ flex: 1, ...screenOptions?.sceneStyle }}>
							{descriptors[route.key].render()}
						</View>
					))}
				</PagerView>
			</Animated.View>
			{tabBar && tabBar({ state, descriptors, navigation, onTabPress: handleTabPress })}
		</View>
	);
}

function SwipeableTabNavigator({
	tabBar,
	screenOptions,
	backBehavior,
	children,
	...rest
}) {
	const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder(
		TabRouter,
		{
			children,
			screenOptions,
			backBehavior,
			...rest
		}
	);

	return (
		<NavigationContent>
			<SwipeableTabView
				state={state}
				descriptors={descriptors}
				navigation={navigation}
				tabBar={tabBar}
				screenOptions={screenOptions}
			/>
		</NavigationContent>
	);
}

export const SwipeableTabs = withLayoutContext(
	createNavigatorFactory(SwipeableTabNavigator)().Navigator
);
