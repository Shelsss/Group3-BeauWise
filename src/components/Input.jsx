import Colors from '@/constants/Colors';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming
} from 'react-native-reanimated';
export default function Input({
	ref,
	children,
	isPassword = false,
	contentType,
	placeholder,
	onChangeText,
	value,
	error
}) {
	const opacity = useSharedValue(0);
	const positionX = useSharedValue(1);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const handlePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: positionX.value }]
		};
	});
	const OFFSET = 5;
	const TIME = 50;

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 200 });
		positionX.value = withSequence(
			withTiming(-OFFSET, { duration: TIME / 2 }),
			withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
			withTiming(0, { duration: TIME / 2 })
		);
	}, [error]);

	return (
		<View>
			<View
				style={{
					backgroundColor: Colors.backgroundColor,
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 8,
					paddingHorizontal: 20,
					borderRadius: 16,
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
				}}
			>
				{children}
				<TextInput
					ref={ref}
					value={value}
					onChangeText={onChangeText}
					style={{ flex: 1 }}
					placeholder={placeholder}
					autoComplete={contentType}
					secureTextEntry={isPassword ? !passwordVisibility : false}
					autoCapitalize='none'
					textContentType={contentType}
				/>

				{isPassword && (
					<View>
						{passwordVisibility ? (
							<TouchableOpacity
								style={{ padding: 4, paddingVertical: 8 }}
								onPress={handlePasswordVisibility}
							>
								<Eye color={Colors.textColor + '7a'} size={16} />
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={{ padding: 4, paddingVertical: 8 }}
								onPress={handlePasswordVisibility}
							>
								<EyeOff color={Colors.textColor + '7a'} size={16} />
							</TouchableOpacity>
						)}
					</View>
				)}

				<Animated.Text
					style={[
						animatedStyle,
						{
							bottom: 2,
							left: 20,
							fontSize: 8,
							position: 'absolute',
							marginLeft: 4,
							color: '#ff6565',
							fontWeight: 500,
							letterSpacing: 0.7
						}
					]}
				>
					{error?.message}
				</Animated.Text>
			</View>
		</View>
	);
}
