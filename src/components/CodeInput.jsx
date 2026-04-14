import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated';

import {
	CodeField,
	Cursor,
	useBlurOnFulfill
} from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors';

const Cell = ({ index, symbol, isFocused }) => {
	const textScale = useSharedValue(0);
	const borderColorShared = useSharedValue(0);

	const animatedText = useAnimatedStyle(() => {
		return {
			transform: [{ scale: textScale.value }]
		};
	});

	const animatedBorder = useAnimatedStyle(() => {
		return {
			borderColor: interpolateColor(
				borderColorShared.value,
				[0, 1],
				['transparent', Colors.primary]
			),
			borderWidth: borderColorShared.value
		};
	});

	useEffect(() => {
		textScale.value = 0;
		textScale.value = withSpring(1, {
			mass: 10,
			duration: 100
		});

		if (!symbol) {
			borderColorShared.value = withTiming(0, { duration: 100 });
			return;
		}

		borderColorShared.value = 0;
		borderColorShared.value = withTiming(1, { duration: 100 });
	}, [symbol]);

	return (
		<Animated.View
			style={[
				styles.cell,
				{
					justifyContent: 'center',
					alignItems: 'center',
					borderWidth: symbol ? 1 : 0
				},
				animatedBorder
			]}
		>
			<Animated.Text
				style={[{ fontSize: 20, fontWeight: 500, color: Colors.textColor }, animatedText]}
			>
				{symbol || (isFocused ? <Cursor /> : null)}
			</Animated.Text>
		</Animated.View>
	);
};

export default function CodeInput({ codeCount, onChangeText, value }) {
	const ref = useBlurOnFulfill({ value, cellCount: codeCount });

	return (
		<CodeField
			ref={ref}
			value={value}
			onChangeText={onChangeText}
			cellCount={codeCount}
			rootStyle={styles.codeFieldRoot}
			keyboardType='number-pad'
			textContentType='oneTimeCode'
			renderCell={({ index, symbol, isFocused }) => (
				<Cell key={index} index={index} symbol={symbol} isFocused={isFocused} />
			)}
		/>
	);
}

const styles = StyleSheet.create({
	codeFieldRoot: {
		justifyContent: 'center'
	},

	cell: {
		marginHorizontal: 6,
		aspectRatio: 1,
		width: 44,

		borderRadius: 8,
		color: Colors.primary,
		backgroundColor: '#fff',

		shadowColor: '#00000055',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3
	}
});
