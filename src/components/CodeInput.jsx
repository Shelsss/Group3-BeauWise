import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
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
import { useThemeStore } from '@/stores/useThemeStore';
import styles from '@/config/styles';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Cell = ({ index, symbol, isFocused, error }) => {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<Animated.View
			style={[
				STYLES.cell,
				{
					borderRadius: styles.border.radius.size.sm,
					backgroundColor: styles.theme.colors[activeTheme].input_background,
					borderColor: error
						? styles.theme.colors.status.red
						: symbol
							? styles.theme.colors.primary
							: styles.theme.colors[activeTheme].input_border,
					justifyContent: 'center',
					alignItems: 'center',
					borderWidth: 1,
					transitionDuration: 220
				}
			]}
		>
			<Animated.Text
				style={[
					{
						opacity: symbol ? 1 : 0,
						fontSize: styles.font.size.xxl,
						fontFamily: styles.font.family,
						fontWeight: styles.font.weight.regular,
						color: styles.theme.colors[activeTheme].text,
						transitionDuration: 240
					}
				]}
			>
				{symbol || (isFocused ? <Cursor /> : null)}
			</Animated.Text>
		</Animated.View>
	);
};

export default function CodeInput({
	codeCount,
	onChangeText,
	value,
	error,
	isBottomSheet = false
}) {
	const ref = useBlurOnFulfill({ value, cellCount: codeCount });

	const inputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;

	return (
		<CodeField
			InputComponent={inputComponent}
			ref={ref}
			value={value}
			submitBehavior='blurAndSubmit'
			onChangeText={onChangeText}
			cellCount={codeCount}
			rootStyle={STYLES.codeFieldRoot}
			keyboardType='number-pad'
			textContentType='oneTimeCode'
			renderCell={({ index, symbol, isFocused }) => (
				<Cell
					error={error}
					key={index}
					index={index}
					symbol={symbol}
					isFocused={isFocused}
				/>
			)}
		/>
	);
}

const STYLES = StyleSheet.create({
	codeFieldRoot: {
		justifyContent: 'center'
	},

	cell: {
		marginHorizontal: 6,
		aspectRatio: 1,
		width: 44
	}
});
