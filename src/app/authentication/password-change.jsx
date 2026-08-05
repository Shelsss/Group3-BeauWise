import PasswordQuestion from '@/components/icons/hugeicons/PasswordQuestion';
import Warn from '@/components/icons/hugeicons/Warn';
import Warn2 from '@/components/icons/hugeicons/Warn2';
import Info from '@/components/icons/Info';
import styles from '@/config/styles';
import { auth } from '@/services/auth';
import { changePassword } from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import { exitScaleAnimation, scaleAnimation } from '@/utility/animations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	updatePassword
} from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const formSchema = z
	.object({
		currentPassword: z.string(),
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

export default function PasswordChange() {
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
		mutationFn: async ({ currentPassword, confirmPassword }) => {
			const credentials = EmailAuthProvider.credential(
				auth.currentUser.email,
				currentPassword
			);

			await reauthenticateWithCredential(auth.currentUser, credentials);

			await updatePassword(auth.currentUser, confirmPassword);

			Toast.show({
				type: 'successToast',
				text1: 'Password is changed successfully',
				props: { activeTheme },
				visibilityTime: 8000
			});
		},

		onError: (e) => {
			Toast.show({
				type: 'errorToast',
				text1: 'Incorrect password',
				props: { activeTheme }
			});
		}
	});

	const onSubmit = ({ currentPassword, confirmPassword }) => {
		passwordChange.mutate({ currentPassword, confirmPassword });
	};

	return (
		<>
			<View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: 15,
					paddingTop: 70,
					paddingBottom: styles.spacing.double_xxl + 5,
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					onPress={router.back}
					style={{
						paddingRight: styles.spacing.xxl
					}}
				>
					<ChevronLeft color={styles.icon.colors._05} size={styles.icon.size.xl} />
				</TouchableOpacity>

				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.lg,
						fontWeight: styles.font.weight.bold,
						color: styles.font.colors._04
					}}
				>
					Change Password
				</Text>
			</View>

			<Animated.View
				entering={FadeIn.delay(300)}
				exiting={FadeOut}
				style={{
					flex: 1,
					alignItems: 'center',

					padding: styles.spacing.double_xl
				}}
			>
				<Text
					style={{
						width: '94%',
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text_secondary,
						fontWeight: styles.font.weight.light,
						fontSize: styles.font.size.md,
						lineHeight: styles.spacing.double_xxl,
						textAlign: 'justify'
					}}
				>
					To maintain the security of your account, please enter your current password,
					followed by your new password. Your new password must be at least 8 characters
					long and contain a combination of uppercase letters, lowercase letters, and
					numbers.
				</Text>
				<View
					style={{
						rowGap: styles.spacing.double_xl * 1.2,
						marginTop: styles.spacing.three_xxl
					}}
				>
					<Controller
						name='currentPassword'
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
										placeholder={'Current Password'}
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
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
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
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
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
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
						width: '96%',
						marginTop: styles.spacing.three_xxl * 1.6,
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

				<View
					style={{
						width: '94%',
						marginTop: styles.spacing.double_xxl,
						marginHorizontal: styles.spacing.xxl,
						borderRadius: styles.border.radius.size.sm,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].disclaimer_border,
						backgroundColor: styles.theme.colors[activeTheme].disclaimer_background
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							columnGap: styles.spacing.md,
							padding: styles.spacing.md
						}}
					>
						<View style={{ transform: [{ rotateZ: '180deg' }, { translateY: 24 }] }}>
							<Warn
								size={styles.icon.size.md}
								color={styles.theme.colors[activeTheme].disclaimer_icon}
							/>
						</View>

						<Text
							style={{
								fontSize: styles.font.size.sm,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].disclaimer_text,
								fontWeight: styles.font.weight.bold
							}}
						>
							Security Advice{' \n'}
							<Text
								style={{
									fontWeight: styles.font.weight.light
								}}
							>
								Don't reuse passwords from other sites or apps. A unique password keeps
								your BeauWise data protected.
							</Text>
						</Text>
					</View>
				</View>
			</Animated.View>
		</>
	);
}
