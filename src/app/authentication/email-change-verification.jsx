import CodeInput from '@/components/CodeInput';
import Info from '@/components/icons/hugeicons/Info';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { auth, logOut } from '@/services/auth';
import {
	changeEmail,
	sendEmailVerification,
	verifyEmail
} from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	createUserWithEmailAndPassword,
	signInWithCredential,
	signInWithEmailAndPassword,
	updateEmail,
	updateProfile
} from '@react-native-firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Swing } from 'react-native-animated-spinkit';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

const formSchema = z.object({
	code: z
		.string()
		.min(6, { error: 'Please enter a six-digit code.' })
		.regex(/^\d+$/, { error: 'Please use numbers only.' })
});
export default function EmailVerification() {
	const queryClient = useQueryClient();
	let { userInfo } = useLocalSearchParams();
	const [timeLeft, setTimeLeft] = useState(0);
	const [isClick, setIsClick] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVerification, setModalVerification] = useState(false);
	userInfo = userInfo ? JSON.parse(userInfo) : null;

	const { control, handleSubmit, watch, setError, clearErrors } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			code: ''
		}
	});

	const sendEmailVerifyMutation = useMutation({
		mutationFn: sendEmailVerification,
		onSuccess: () => {
			clearErrors('code');
			startTimer();
		},
		onError: (err) => {
			setError('code', { message: err.message });
		}
	});

	const verifyEmailMutation = useMutation({
		mutationFn: verifyEmail,

		onSuccess: async ({ result }) => {
			if (!result?.success) {
				throw new Error(result?.message);
			}

			const { updatedEmail } = await changeEmail({
				previousEmail: auth.currentUser.email,
				newEmail: userInfo.email
			});

			await logOut();

			setModalVisible(true);
		},

		onError: (err) => {
			let errMessage = 'Something went wrong. Please try again.';

			if (err.code === 'cancelled') {
				errMessage = err.message;
			}

			if (err?.code === 'auth/email-already-in-use') {
				router.back();
				Toast.show({
					type: 'errorToast',
					text1: 'Update Failed',
					text2: 'The provided email is already in use.',
					bottomOffset: 120,
					position: 'bottom',
					visibilityTime: 15000
				});
				return;
			}

			setError('code', { message: errMessage });
		}
	});

	const codeInput = watch('code');
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const animationRef = useRef(null);
	const requiredInput = 6;

	const onSubmit = () => {
		setModalVerification(true);
	};

	const handleSubmitConfirm = () => {
		const code = codeInput;
		verifyEmailMutation.mutate({
			code,
			userInfo: {
				email: userInfo.email,
				name: userInfo.name
			}
		});

		setModalVerification(false);
	};

	const startTimer = () => {
		setTimeLeft((prev) => prev + 50);
		setIsClick(!isClick);
		animationRef.current?.play();
	};

	const sendCode = () =>
		sendEmailVerifyMutation.mutate({
			userInfo: {
				email: userInfo?.email,
				name: userInfo?.name
			}
		});

	const debouncedSendCode = useDebouncedCallback(sendCode, 800);

	useEffect(() => {
		debouncedSendCode();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer);

					return 0;
				}

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isClick]);

	return (
		<View style={{ flex: 1, padding: 20, marginTop: '20%' }}>
			<TouchableOpacity
				activeOpacity={0.7}
				style={{ position: 'absolute', left: styles.spacing.one_xl, top: -20 }}
				onPress={router.back}
			>
				<ChevronLeft strokeWidth={1.5} color={styles.theme.colors[activeTheme].icon} />
			</TouchableOpacity>

			<LottieView
				ref={animationRef}
				style={{
					alignSelf: 'center',
					aspectRatio: 1,
					width: 260
				}}
				autoPlay={false}
				loop={false}
				source={require('assets/lottie/email-send-animation.json')}
			/>

			<View style={{ rowGap: styles.spacing.xxl }}>
				<Text
					style={{
						textAlign: 'center',
						fontSize: styles.font.size.xxl,
						fontWeight: styles.font.weight.bold,
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					Code Verification
				</Text>
				<Text
					style={{
						fontSize: styles.font.size.md,
						textAlign: 'center',
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					We've sent a 6-digit verification code to {userInfo?.email}. Please enter the
					code below.
				</Text>
			</View>

			<View style={{ marginTop: styles.spacing.three_xxl }}>
				<Controller
					control={control}
					render={({ field: { value: code, onChange }, fieldState: { error } }) => {
						return (
							<View>
								{error && (
									<Animated.Text
										entering={FadeIn}
										exiting={FadeOut.duration(120)}
										style={{
											top: -20,
											fontSize: styles.font.size.sm,
											fontFamily: styles.font.family,
											color: styles.theme.colors.status.red,
											position: 'absolute'
										}}
									>
										{error.message}
									</Animated.Text>
								)}

								<CodeInput
									onChangeText={onChange}
									value={code}
									codeCount={requiredInput}
									error={error}
								/>
							</View>
						);
					}}
					name='code'
				/>

				<View style={{ marginTop: styles.spacing.three_xxl * 1.2, rowGap: 12 }}>
					<TouchableOpacity
						activeOpacity={0.7}
						style={{
							opacity: codeInput.length === requiredInput ? 1 : 0.7,
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.xxl,
							backgroundColor: styles.theme.colors.primary,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
						disabled={codeInput.length !== requiredInput || verifyEmailMutation.isPending}
						onPress={handleSubmit(onSubmit)}
					>
						{!verifyEmailMutation.isPending && (
							<Animated.Text
								entering={FadeIn}
								exiting={FadeOut.duration(120)}
								style={{
									color: '#fff',
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									fontSize: styles.font.size.md,
									textAlign: 'center'
								}}
							>
								Verify
							</Animated.Text>
						)}

						{verifyEmailMutation.isPending && (
							<Animated.View
								entering={FadeIn}
								exiting={FadeOut.duration(120)}
								style={{ flexDirection: 'row', columnGap: styles.spacing.md }}
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
									Please wait...
								</Text>

								<ActivityIndicator
									color={styles.icon.colors._05}
									size={styles.icon.size.xl}
								/>
							</Animated.View>
						)}
					</TouchableOpacity>

					<View
						style={{
							alignItems: 'center',
							marginTop: styles.spacing.three_xxl,
							flexDirection: 'row',
							columnGap: styles.spacing.sm,
							alignSelf: 'center'
						}}
					>
						<Text
							style={{
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md
							}}
						>
							Didn't receive the code?
						</Text>
						<TouchableOpacity
							disabled={timeLeft > 0 || sendEmailVerifyMutation.isPending}
							onPress={sendCode}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text,
									fontFamily: styles.font.family
								}}
							>
								{timeLeft > 0 &&
									!sendEmailVerifyMutation.isPending &&
									`Resend code after `}

								{timeLeft <= 0 && !sendEmailVerifyMutation.isPending && 'Send Code'}
								{timeLeft > 0 && !sendEmailVerifyMutation.isPending && (
									<Text style={{ color: Colors.primary }}>{timeLeft}s</Text>
								)}
							</Text>

							{sendEmailVerifyMutation.isPending && (
								<Animated.View
									entering={FadeIn}
									exiting={FadeOut.duration(120)}
									style={{
										position: 'absolute',
										marginLeft: styles.spacing.md
									}}
								>
									<ActivityIndicator
										color={styles.theme.colors.primary}
										size={styles.icon.size.xl}
									/>
								</Animated.View>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<Portal>
				<Modal
					visible={modalVerification}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							padding: styles.spacing.double_xl,
							borderRadius: styles.border.radius.size.sm,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							justifyContent: 'center',
							alignItems: 'center',
							width: '80%',
							rowGap: styles.spacing.sm
						}}
					>
						<Text
							style={{
								fontSize: styles.font.size.xl,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Confirm email change
						</Text>
						<Text
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							You will be logged out. You must then log in with your new email address.
						</Text>
						<View
							style={{
								flexDirection: 'row',
								columnGap: styles.spacing.md,
								marginTop: styles.spacing.xxl,
								alignSelf: 'flex-end'
							}}
						>
							<TouchableOpacity
								onPress={() => setModalVerification(false)}
								style={{
									paddingVertical: styles.spacing.xl,

									borderRadius: styles.border.radius.size.sm,
									paddingHorizontal: styles.spacing.xxl
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.lg,
										fontFamily: styles.font.family,
										fontWeight: styles.font.weight.regular,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Cancel
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleSubmitConfirm}
								style={{
									paddingVertical: styles.spacing.xl,
									backgroundColor: styles.theme.colors.primary,
									borderRadius: styles.border.radius.size.sm,
									paddingHorizontal: styles.spacing.xxl
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.lg,
										fontFamily: styles.font.family,
										fontWeight: styles.font.weight.regular,
										color: styles.font.colors._04
									}}
								>
									Confirm
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</Portal>

			<Portal>
				<Modal
					visible={modalVisible}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							width: 270,
							padding: styles.spacing.xxl,
							borderRadius: styles.border.radius.size.sm,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							alignItems: 'center',
							rowGap: styles.spacing.sm
						}}
					>
						<Info size={styles.icon.size.xl * 2} color={styles.theme.colors.primary} />
						<Text
							style={{
								textAlign: 'center',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Your email is successfully updated to {userInfo.email}
						</Text>
					</View>

					<TouchableOpacity
						onPress={() => {
							router.dismissAll();
							router.push('authentication/sign-in');
						}}
						style={{
							position: 'absolute',
							bottom: -50,
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.pill,
							alignSelf: 'center',
							flexDirection: 'row',
							padding: styles.spacing.lg
						}}
					>
						<Text
							style={{
								fontSize: styles.font.size.lg,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular,
								color: styles.font.colors._04
							}}
						>
							<X size={styles.icon.size.xl} />
						</Text>
					</TouchableOpacity>
				</Modal>
			</Portal>
		</View>
	);
}
