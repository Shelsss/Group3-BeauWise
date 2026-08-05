import styles from '@/config/styles';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ShieldCheck from '../icons/hugeicons/ShieldCheck';
import { Circle } from 'lucide-react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import Warn from '../icons/hugeicons/Warn';
import { useState } from 'react';
import { entryScaleHeight, exitScaleAnimation } from '@/utility/animations';
import { Controller } from 'react-hook-form';

const fdaSchema = [
	{
		title: 'What does FDA verification mean?',
		definitions: [
			'The product has an active FDA notification authorizing legal market distribution in the Philippines.',
			'The product formulation is subject to FDA regulatory requirements regarding prohibited and restricted substances.',
			'The manufacturer or distributor holds an active notification status with the FDA.',
			'The product complies with baseline FDA notification requirements.'
		]
	},

	{
		name: 'Product Name',
		placeholder: 'Enter product name or brand...'
	},
	{
		name: 'Notification No.',
		placeholder: 'Enter NN - code (e.g. NN-12678...)'
	}
];

export default function InitialPage({
	onSubmit,
	control,
	controllerName,
	activeTab,
	onTabChanged,
	activeTheme
}) {
	const [activeTabPositionX, setActiveTabPositionX] = useState({
		1: 0,
		2: 0
	});
	const [activeTabPositionSize, setActiveTabPositionSize] = useState({
		1: {
			width: 0,
			height: 0
		},
		2: {
			width: 0,
			height: 0
		}
	});

	const tabIndicatorX = useSharedValue(4);

	const handleTabChange = (index) => () => {
		onTabChanged(index);

		tabIndicatorX.value = withSpring(activeTabPositionX[index], {
			damping: 200
		});
	};

	const tabIndicatorAnimated = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: tabIndicatorX.value }]
		};
	});

	return (
		<>
			<Animated.View
				entering={entryScaleHeight}
				exiting={exitScaleAnimation}
				style={{
					position: 'absolute',
					alignSelf: 'center',
					top: 110,
					rowGap: styles.spacing.one_xxl
				}}
			>
				<View
					style={{
						alignSelf: 'center',
						width: '92%',
						alignItems: 'center',
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xxl,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderColor: styles.theme.colors[activeTheme].card_border,
						borderWidth: 1,
						rowGap: styles.spacing.one_xxl
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.lg
						}}
					>
						<ShieldCheck
							color={styles.theme.colors.fda}
							size={styles.icon.size.xl * 1.4}
						/>
						<Text
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{fdaSchema[0].title}
						</Text>
					</View>

					<TouchableOpacity
						onPress={onSubmit}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							alignSelf: 'center',
							position: 'absolute',
							bottom: -350,
							backgroundColor: styles.theme.colors.fda,
							width: '100%',
							paddingVertical: styles.spacing.xl,
							alignItems: 'center',
							zIndex: 2
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.font.colors._04
							}}
						>
							Verify
						</Text>
					</TouchableOpacity>

					<View style={{ rowGap: styles.spacing.xl, alignItems: 'center' }}>
						{fdaSchema[0].definitions.map((def) => (
							<View
								key={def}
								style={{ flexDirection: 'row', columnGap: styles.spacing.lg }}
							>
								<Circle
									strokeWidth={0}
									fill={styles.theme.colors[activeTheme].icon}
									style={{ marginTop: 4.4 }}
									size={6}
								/>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text_secondary
									}}
								>
									{def}
								</Text>
							</View>
						))}
					</View>
				</View>

				<Animated.View
					layout={LinearTransition.springify().damping(120)}
					style={[
						{
							alignSelf: 'center',
							width: '92%',
							alignItems: 'center',
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.one_xxl,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							borderColor: styles.theme.colors[activeTheme].card_border,
							borderWidth: 1,
							rowGap: styles.spacing.one_xxl
						}
					]}
				>
					<View
						style={{
							width: '100%',

							borderRadius: styles.border.radius.size.sm,
							backgroundColor: styles.theme.colors.fda + '2a',
							flexDirection: 'row',
							alignItems: 'center',

							padding: 4
						}}
					>
						<TouchableOpacity
							onPress={handleTabChange(1)}
							onLayout={(event) => {
								const { x, width, height } = event.nativeEvent.layout;

								setActiveTabPositionX((prev) => ({
									...prev,
									1: x
								}));

								setActiveTabPositionSize((prev) => ({
									2: { ...prev[2] },
									1: {
										width,
										height
									}
								}));
							}}
							style={{
								flex: 1,
								alignItems: 'center',
								paddingVertical: styles.spacing.xl,
								zIndex: 1
							}}
						>
							<Animated.Text
								style={{
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.regular,
									fontSize: styles.font.size.md,
									color:
										activeTab === 1
											? styles.font.colors._04
											: styles.theme.colors[activeTheme].text + '7a',
									transitionDuration: 160
								}}
							>
								{fdaSchema[1].name}
							</Animated.Text>
						</TouchableOpacity>

						<TouchableOpacity
							onLayout={(event) => {
								const { x, width, height } = event.nativeEvent.layout;

								setActiveTabPositionX((prev) => ({
									...prev,
									2: x
								}));

								setActiveTabPositionSize((prev) => ({
									1: { ...prev[1] },
									2: {
										width,
										height
									}
								}));
							}}
							onPress={handleTabChange(2)}
							style={{
								flex: 1,
								alignItems: 'center',
								zIndex: 1,
								paddingVertical: styles.spacing.xl
							}}
						>
							<Animated.Text
								style={{
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.regular,
									fontSize: styles.font.size.md,
									color:
										activeTab === 2
											? styles.font.colors._04
											: styles.theme.colors[activeTheme].text + '7a',
									transitionDuration: 160
								}}
							>
								{fdaSchema[2].name}
							</Animated.Text>
						</TouchableOpacity>
						<Animated.View
							pointerEvents='none'
							style={[
								{
									borderRadius: styles.border.radius.size.sm,
									position: 'absolute',
									zIndex: 0,

									height: activeTabPositionSize[activeTab].height,
									width: activeTabPositionSize[activeTab].width,

									backgroundColor: styles.theme.colors.fda
								},
								tabIndicatorAnimated
							]}
						/>
					</View>

					<View style={{ width: '100%', rowGap: styles.spacing.xxl }}>
						<Controller
							control={control}
							name={controllerName}
							render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
								<Animated.View
									style={{
										paddingHorizontal: styles.spacing.md,
										borderRadius: styles.border.radius.size.sm,
										width: '100%',
										borderWidth: 1,
										backgroundColor: styles.theme.colors[activeTheme].input_background,
										borderColor: error
											? styles.theme.colors.status.red
											: styles.theme.colors[activeTheme].input_border,
										transitionDuration: 400
									}}
								>
									{error && (
										<Animated.Text
											exiting={FadeOut}
											entering={FadeIn}
											style={{
												position: 'absolute',
												color: styles.theme.colors.status.red,
												fontFamily: styles.font.family,
												fontSize: styles.font.size.sm,
												zIndex: 2,
												left: 6,
												top: -16
											}}
										>
											{error.message}
										</Animated.Text>
									)}

									<TextInput
										style={{
											color: styles.theme.colors[activeTheme].text,

											fontFamily: styles.font.family,
											fontSize: styles.font.size.md
										}}
										value={value}
										onBlur={onBlur}
										onChangeText={onChange}
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
										cursorColor={styles.theme.colors.fda}
										selectionColor={styles.theme.colors.fda}
										selectionHandleColor={styles.theme.colors.fda}
										placeholder={
											activeTab === 1
												? 'Enter product name or brand...'
												: 'Enter NN- code (e.g., NN-10000...)'
										}
									/>
								</Animated.View>
							)}
						/>

						<View
							style={{
								borderRadius: styles.border.radius.size.sm,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].tip_border,
								backgroundColor: styles.theme.colors[activeTheme].tip_background
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									columnGap: styles.spacing.md,
									padding: styles.spacing.md
								}}
							>
								<View style={{ marginTop: styles.spacing.sm }}>
									<Warn
										size={styles.icon.size.md}
										color={styles.theme.colors[activeTheme].tip_icon}
									/>
								</View>

								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].tip_text
									}}
								>
									Tip:{' '}
									<Text>
										{activeTab === 1
											? 'Enter the exact product name as it appears on the packaging for more accurate results.'
											: 'Enter the complete Notification Number including the “NN-” prefix, usually found on the product label or packaging.'}
									</Text>
								</Text>
							</View>
						</View>
					</View>
				</Animated.View>
			</Animated.View>
		</>
	);
}
