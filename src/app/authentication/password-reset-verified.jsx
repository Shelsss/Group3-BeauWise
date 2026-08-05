import PasswordQuestion from '@/components/icons/hugeicons/PasswordQuestion';
import styles from '@/config/styles';
import { changePassword } from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Eye, EyeClosed } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { z } from 'zod';

const formSchema = z
	.object({
		password: z
			.string()
			.min(8, { error: 'Password must be at least 8 characters long' })
			.max(20, { error: 'Password must be at most 20 characters long' })
			.refine((password) => /[A-Z]/.test(password), {
				error: 'Password must contain at least one uppercase letter'
			})
			.refine((password) => /[a-z]/.test(password), {
				error: 'Password must contain at least one lowercase letter'
			})
			.refine((password) => /[0-9]/.test(password), {
				error: 'Password must contain at least one number'
			})
			.refine((password) => /[!@#$%^&*]/.test(password), {
				error: 'Password must contain at least one special character'
			}),

		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password doesn't match!",
		path: ['confirmPassword']
	});

export default function PasswordResetVerified() {
	const { email } = useLocalSearchParams();
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [passwordVisible, setPasswordVisible] = useState(true);

	const showPassword = () => setPasswordVisible(true);
	const hidePassword = () => setPasswordVisible(false);

	const { control, handleSubmit } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	});

	const passwordChange = useMutation({
		mutationFn: changePassword
	});

	const onSubmit = ({ confirmPassword }) => {
		passwordChange.mutate({ email, password: confirmPassword });
	};

	return (
		<Animated.View
			style={{
				flex: 1,
				alignItems: 'center',

				padding: styles.spacing.double_xl
			}}
		>
			{passwordChange.isSuccess && passwordChange.data?.result?.success ? (
				<Animated.View
					entering={FadeIn.delay(220)}
					exiting={FadeOut}
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						marginTop: '50%'
					}}
				>
					<LottieView
						style={{
							aspectRatio: 1,
							width: 180
						}}
						autoPlay
						loop={false}
						source={require('assets/lottie/check-animation.json')}
					/>

					<View style={{ rowGap: styles.spacing.md }}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: styles.font.size.xxl,
								fontWeight: styles.font.weight.bold,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Password Reset Successfully!
						</Text>
						<Text
							style={{
								lineHeight: styles.spacing.double_xl,
								width: 280,
								fontSize: styles.font.size.md,
								textAlign: 'center',
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text_secondary
							}}
						>
							Your new password must be at least 8 characters long and include a strong
							combination of letters, numbers, and symbols
						</Text>
					</View>

					<TouchableOpacity
						disabled={passwordChange.isPending}
						onPress={router.back}
						activeOpacity={0.7}
						style={{
							marginTop: styles.spacing.three_xxl,
							width: '100%',
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.xl,
							backgroundColor: styles.theme.colors.primary,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.semi_bold,
								fontSize: styles.font.size.md,
								textAlign: 'center'
							}}
						>
							Back
						</Text>
					</TouchableOpacity>
				</Animated.View>
			) : (
				<Animated.View
					entering={FadeIn.delay(300)}
					exiting={FadeOut}
					style={{ flex: 1, marginTop: '30%' }}
				>
					<View style={{ rowGap: styles.spacing.md, alignItems: 'center' }}>
						<View
							style={{ alignItems: 'center', marginBottom: styles.spacing.double_xl }}
						>
							<PasswordQuestion
								color={styles.theme.colors.primary}
								size={styles.icon.size.xl * 10}
							/>
						</View>

						<Text
							style={{
								textAlign: 'center',
								fontSize: styles.font.size.xxl,
								fontWeight: styles.font.weight.bold,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Create New Password
						</Text>
						<Text
							style={{
								lineHeight: styles.spacing.double_xl,
								width: 280,
								fontSize: styles.font.size.md,
								textAlign: 'center',
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text_secondary
							}}
						>
							Your new password must be at least 8 characters long and include a strong
							combination of letters, numbers, and symbols
						</Text>
					</View>

					<View
						style={{
							width: '100%',
							rowGap: styles.spacing.double_xl * 1.2,
							marginTop: styles.spacing.three_xxl
						}}
					>
						<Controller
							name='password'
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => {
								return (
									<Animated.View
										style={{
											borderRadius: styles.border.radius.size.sm,
											backgroundColor: styles.theme.colors[activeTheme].input_background,
											borderWidth: 1,
											borderColor: error
												? styles.theme.colors.status.red
												: styles.theme.colors[activeTheme].input_border,
											flexDirection: 'row',
											alignItems: 'center',
											transitionDuration: 220
										}}
									>
										{error && (
											<Animated.Text
												entering={FadeIn}
												exiting={FadeOut.duration(120)}
												style={{
													fontFamily: styles.font.family,
													color: styles.theme.colors.status.red,
													position: 'absolute',
													fontSize: styles.font.size.sm,
													top: -18
												}}
											>
												{error.message}
											</Animated.Text>
										)}
										<TextInput
											value={value}
											onChangeText={onChange}
											cursorColor={styles.theme.colors.primary}
											selectionColor={styles.theme.colors.primary}
											selectionHandleColor={styles.theme.colors.primary}
											placeholder={'New Password'}
											placeholderTextColor={
												styles.theme.colors[activeTheme].text_secondary
											}
											style={{
												width: '86%',
												paddingLeft: styles.spacing.xxl,
												fontFamily: styles.font.family,
												fontSize: styles.font.size.md,
												color: styles.theme.colors[activeTheme].text
											}}
											secureTextEntry={passwordVisible}
										/>

										{passwordVisible && (
											<TouchableOpacity
												onPress={hidePassword}
												style={{
													marginLeft: 'auto',
													marginRight: styles.spacing.xxl
												}}
											>
												<EyeClosed
													size={styles.icon.size.xl}
													color={styles.theme.colors[activeTheme].icon + '9a'}
												/>
											</TouchableOpacity>
										)}

										{!passwordVisible && (
											<TouchableOpacity
												onPress={showPassword}
												style={{
													marginLeft: 'auto',
													marginRight: styles.spacing.xxl
												}}
											>
												<Eye
													size={styles.icon.size.xl}
													color={styles.theme.colors[activeTheme].icon + '9a'}
												/>
											</TouchableOpacity>
										)}
									</Animated.View>
								);
							}}
						/>

						<Controller
							name='confirmPassword'
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => {
								return (
									<Animated.View
										style={{
											borderRadius: styles.border.radius.size.sm,
											backgroundColor: styles.theme.colors[activeTheme].input_background,
											borderWidth: 1,
											borderColor: error
												? styles.theme.colors.status.red
												: styles.theme.colors[activeTheme].input_border,
											flexDirection: 'row',
											alignItems: 'center',
											transitionDuration: 220
										}}
									>
										{error && (
											<Animated.Text
												entering={FadeIn}
												exiting={FadeOut.duration(120)}
												style={{
													fontFamily: styles.font.family,
													color: styles.theme.colors.status.red,
													position: 'absolute',
													fontSize: styles.font.size.sm,
													top: -18
												}}
											>
												{error.message}
											</Animated.Text>
										)}

										<TextInput
											value={value}
											onChangeText={onChange}
											cursorColor={styles.theme.colors.primary}
											selectionColor={styles.theme.colors.primary}
											selectionHandleColor={styles.theme.colors.primary}
											placeholder={'Confirm Password'}
											placeholderTextColor={
												styles.theme.colors[activeTheme].text_secondary
											}
											style={{
												width: '86%',
												paddingLeft: styles.spacing.xxl,
												fontFamily: styles.font.family,
												fontSize: styles.font.size.md,
												color: styles.theme.colors[activeTheme].text
											}}
											textContentType='password'
											secureTextEntry={passwordVisible}
										/>

										{passwordVisible && (
											<TouchableOpacity
												onPress={hidePassword}
												style={{
													marginLeft: 'auto',
													marginRight: styles.spacing.xxl
												}}
											>
												<EyeClosed
													size={styles.icon.size.xl}
													color={styles.theme.colors[activeTheme].icon + '9a'}
												/>
											</TouchableOpacity>
										)}

										{!passwordVisible && (
											<TouchableOpacity
												onPress={showPassword}
												style={{
													marginLeft: 'auto',
													marginRight: styles.spacing.xxl
												}}
											>
												<Eye
													size={styles.icon.size.xl}
													color={styles.theme.colors[activeTheme].icon + '9a'}
												/>
											</TouchableOpacity>
										)}
									</Animated.View>
								);
							}}
						/>
					</View>

					<TouchableOpacity
						disabled={passwordChange.isPending}
						onPress={handleSubmit(onSubmit)}
						activeOpacity={0.7}
						style={{
							marginTop: styles.spacing.three_xxl * 4,
							opacity: passwordChange.isPending ? 0.4 : 1,
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.xl,
							backgroundColor: styles.theme.colors.primary,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Animated.View
							layout={LinearTransition.springify().damping(200)}
							style={{
								alignItems: 'center',
								flexDirection: 'row',
								columnGap: styles.spacing.lg
							}}
						>
							<Text
								style={{
									color: '#fff',
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									fontSize: styles.font.size.md,
									textAlign: 'center'
								}}
							>
								{passwordChange.isPending ? 'Saving changes...' : 'Confirm Change'}
							</Text>

							{passwordChange.isPending && (
								<Animated.View entering={FadeIn} exiting={FadeOut}>
									<ActivityIndicator
										size={styles.icon.size.xl}
										color={styles.icon.colors._05}
									/>
								</Animated.View>
							)}
						</Animated.View>
					</TouchableOpacity>
				</Animated.View>
			)}
		</Animated.View>
	);
}
