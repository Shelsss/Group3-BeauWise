import Colors from '@/constants/Colors';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import Warn from './icons/hugeicons/Warn';
import styles from '@/config/styles';
export default function Input({
	focusNextInput = null,
	enterKeyHint = 'done',
	ref,
	children,
	isPassword = false,
	contentType,
	label,
	onChangeText,
	value,
	error,
	activeTheme
}) {
	const labelPositionY = useSharedValue(0);
	const labelPositionX = useSharedValue(14);
	const labelFontSize = useSharedValue(styles.font.size.sm);
	const opacity = useSharedValue(0);
	const passwordOpacity = useSharedValue(0);
	const borderColorShared = useSharedValue(0);

	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const handlePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		};
	});

	const animatedPasswordStyle = useAnimatedStyle(() => {
		return {
			opacity: passwordOpacity.value
		};
	});

	const labelAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateY: labelPositionY.value },
				{ translateX: labelPositionX.value }
			],
			fontSize: labelFontSize.value
		};
	});

	const animatedBorder = useAnimatedStyle(() => {
		return {
			borderColor: interpolateColor(
				borderColorShared.value,
				[0, 1],
				['transparent', '#ffc1c1']
			)
		};
	});

	const minimizeLabel = () => {
		labelPositionY.value = withTiming(-12, { duration: 130 });
		labelFontSize.value = withTiming(styles.font.size.xs, { duration: 130 });
	};

	const restartLabel = () => {
		labelPositionY.value = withTiming(0, { duration: 130 });
		labelFontSize.value = withTiming(styles.font.size.sm, { duration: 130 });
	};

	useEffect(() => {
		if (value.length > 0) {
			passwordOpacity.value = withTiming(1, { duration: 100 });
		}

		if (value.length <= 0) {
			passwordOpacity.value = withTiming(0, { duration: 100 });
		}

		if (!error) {
			borderColorShared.value = withTiming(0, { duration: 300 });
			opacity.value = withTiming(0, { duration: 50 });
			return;
		}

		opacity.value = withTiming(1, { duration: 100 });
		borderColorShared.value = withTiming(1, { duration: 300 });
	}, [error, value]);

	return (
		<View>
			<Animated.View
				style={[
					animatedBorder,
					{
						borderWidth: 1,
						backgroundColor: styles.theme.colors[activeTheme].input_background,
						borderColor: styles.theme.colors[activeTheme].input_border,
						flexDirection: 'row',
						alignItems: 'center',
						padding: styles.spacing.sm,
						borderRadius: styles.border.radius.size.md
					}
				]}
			>
				<View>{children}</View>

				<Animated.Text
					style={[
						{
							fontFamily: styles.font.family,
							position: 'absolute',
							fontSize: styles.font.size.sm,
							transform: [{ translateX: 42 }, { translateY: 0 }],
							color: styles.theme.colors[activeTheme].text
						},
						labelAnimatedStyle
					]}
				>
					{label}
				</Animated.Text>
				<TextInput
					onEndEditing={() => {
						if (value.length > 0) return;
						restartLabel();
					}}
					onFocus={() => {
						minimizeLabel();
					}}
					ref={ref}
					value={value}
					cursorColor={styles.theme.colors.primary}
					onChangeText={onChangeText}
					submitBehavior={focusNextInput ? 'submit' : 'blurAndSubmit'}
					onSubmitEditing={() => {
						if (focusNextInput) {
							focusNextInput();
						}
					}}
					style={{
						fontFamily: styles.font.family,
						flex: 1,
						fontSize: styles.font.size.sm,
						paddingLeft: styles.spacing.xl - 2,
						marginTop: styles.spacing.sm,
						textTransform: label === 'Full Name' ? 'capitalize' : 'none',
						color: styles.theme.colors[activeTheme].text
					}}
					selectionColor={styles.theme.colors.primary}
					autoComplete={contentType}
					secureTextEntry={isPassword ? !passwordVisibility : false}
					autoCapitalize='none'
					textContentType={contentType}
					enterKeyHint={enterKeyHint}
				/>

				{isPassword && (
					<Animated.View
						style={[animatedPasswordStyle, { marginRight: styles.spacing.md }]}
					>
						{passwordVisibility ? (
							<TouchableOpacity style={{ padding: 4 }} onPress={handlePasswordVisibility}>
								<EyeOff
									color={
										activeTheme !== 'dark'
											? styles.font.colors._01 + '7a'
											: styles.font.colors._04
									}
									size={14}
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={{ padding: 4 }} onPress={handlePasswordVisibility}>
								<Eye
									color={
										activeTheme !== 'dark'
											? styles.font.colors._01 + '7a'
											: styles.font.colors._04
									}
									size={14}
								/>
							</TouchableOpacity>
						)}
					</Animated.View>
				)}

				<Animated.View
					style={[
						{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: 4,
							bottom: 2,
							left: 14,
							position: 'absolute'
						},
						error && animatedStyle
					]}
				>
					{error && (
						<>
							<Animated.View>
								<Warn color={styles.icon.colors._01} size={styles.icon.size.xs} />
							</Animated.View>

							<Animated.Text
								style={[
									{
										alignItems: 'center',
										fontFamily: styles.font.family,
										fontSize: styles.font.size.xs,
										color: styles.icon.colors._01,
										fontWeight: 500,
										letterSpacing: 0.7,
										paddingBottom: !error && 1.5
									}
								]}
							>
								{error?.message}
							</Animated.Text>
						</>
					)}
				</Animated.View>
			</Animated.View>
		</View>
	);
}
