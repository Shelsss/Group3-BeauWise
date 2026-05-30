import Colors from '@/constants/Colors';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming
} from 'react-native-reanimated';
import Warn from './icons/hugeicons/Warn';
export default function Input({
	ref,
	children,
	isPassword = false,
	contentType,
	label,
	onChangeText,
	value,
	error
}) {
	const labelPositionY = useSharedValue(0);
	const labelPositionX = useSharedValue(42);
	const labelFontSize = useSharedValue(14);
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
		labelPositionY.value = withTiming(-16, { duration: 130 });
		labelFontSize.value = withTiming(8, { duration: 130 });
	};

	const restartLabel = () => {
		labelPositionY.value = withTiming(0, { duration: 130 });
		labelFontSize.value = withTiming(14, { duration: 130 });
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
					{
						borderWidth: 1,
						backgroundColor: Colors.backgroundColor,
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: 8,
						paddingHorizontal: 14,
						borderRadius: 12,
						columnGap: 6,
						shadowColor: '#000000a3',
						shadowOffset: {
							width: 0,
							height: 1
						},
						shadowOpacity: 0.2,
						shadowRadius: 1.41,

						elevation: 2,
						overflow: 'hidden'
					},
					animatedBorder
				]}
			>
				<View>{children}</View>

				<Animated.Text
					style={[
						{
							fontFamily: 'Outfit',
							position: 'absolute',
							fontSize: 14,
							transform: [{ translateX: 42 }, { translateY: 0 }],
							color: Colors.textColor + '9a'
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
					cursorColor={Colors.textColor}
					onChangeText={onChangeText}
					style={{ fontFamily: 'Outfit', flex: 1 }}
					autoComplete={contentType}
					secureTextEntry={isPassword ? !passwordVisibility : false}
					autoCapitalize='none'
					textContentType={contentType}
				/>

				{isPassword && (
					<Animated.View style={animatedPasswordStyle}>
						{passwordVisibility ? (
							<TouchableOpacity
								style={{ padding: 4, paddingVertical: 8 }}
								onPress={handlePasswordVisibility}
							>
								<EyeOff color={Colors.textColor + '7a'} size={16} />
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={{ padding: 4, paddingVertical: 8 }}
								onPress={handlePasswordVisibility}
							>
								<Eye color={Colors.textColor + '7a'} size={16} />
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
							left: 20,
							position: 'absolute',
							marginLeft: 4
						},
						error && animatedStyle
					]}
				>
					{error && (
						<>
							<Animated.View>
								<Warn color={'#ff6565'} size={10} />
							</Animated.View>

							<Animated.Text
								style={[
									{
										alignItems: 'center',
										fontFamily: 'Outfit',
										fontSize: 9,
										color: '#ff6565',
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
