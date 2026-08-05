import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, BackHandler, View, TouchableOpacity } from 'react-native';

import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';

import Colors from '@/constants/Colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '@/config/styles';
import Animated, { createAnimatedComponent } from 'react-native-reanimated';
import Calendar2 from '../icons/hugeicons/Calendar2';
import Calendar3 from '../icons/hugeicons/Calendar3';
import Calendar4 from '../icons/hugeicons/Calendar4';
import Calendar5 from '../icons/hugeicons/Calendar5';

const filters = [
	{
		label: 'All Time',
		field: 'all_time',
		icon: (size, color) => <Calendar2 size={size} color={color} />
	},
	{
		label: 'Today',
		field: 'today',
		icon: (size, color) => <Calendar3 size={size} color={color} />
	},
	{
		label: 'Yesterday',
		field: 'yesterday',
		icon: (size, color) => <Calendar4 size={size} color={color} />
	},
	{
		label: 'This Month',
		field: 'this_month',
		icon: (size, color) => <Calendar5 size={size} color={color} />
	}
];

const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);
const HistoryBottomSheet = ({ historySheetModalRef, activeTheme, onChangeFilter }) => {
	const [filter, setFilter] = useState(() => filters[0].field);
	const { bottom } = useSafeAreaInsets();
	const { dismiss } = useBottomSheetModal();

	useEffect(() => {
		const backAction = () => {
			return dismiss();
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={0.7} disappearsOnIndex={-1} />,
		[]
	);

	const handlePress = (value) => () => {
		setFilter(value);
	};

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	return (
		<>
			<BottomSheetModal
				animationConfigs={animationConfigs}
				handleComponent={null}
				backgroundStyle={{
					backgroundColor: styles.theme.colors[activeTheme].screen_background,
					borderRadius: styles.border.radius.size.sm
				}}
				ref={historySheetModalRef}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={[STYLES.contentContainer]}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',

							alignItems: 'center',
							justifyContent: 'center',
							marginTop: styles.spacing.double_xl,
							marginBottom: styles.spacing.double_xl
						}}
					>
						<Text
							style={{
								fontSize: styles.font.size.xl,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family
							}}
						>
							Sort By
						</Text>
					</View>

					<View
						style={{
							display: 'flex',
							rowGap: 16,
							marginBottom: styles.spacing.three_xxl * 1.4
						}}
					>
						{filters.map((item, index) => (
							<AnimatedTouchableOpacity
								activeOpacity={0.7}
								key={item.field}
								onPress={() => {
									handlePress(item.field).call();
									onChangeFilter(item.field);
								}}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									columnGap: styles.spacing.md,
									borderRadius: styles.border.radius.size.sm,
									paddingVertical: 18,
									overflow: 'hidden',
									backgroundColor: filter === item.field ? Colors.primary : 'transparent',
									transitionDuration: 140
								}}
							>
								{item.icon(
									styles.icon.size.xl,
									filter === item.field
										? styles.icon.colors._05
										: styles.theme.colors[activeTheme].icon
								)}

								<Animated.Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color:
											filter === item.field
												? styles.font.colors._04
												: styles.theme.colors[activeTheme].text,
										fontWeight: styles.font.weight.regular,
										transitionDuration: 140
									}}
								>
									{item.label}
								</Animated.Text>
							</AnimatedTouchableOpacity>
						))}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const STYLES = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default HistoryBottomSheet;
