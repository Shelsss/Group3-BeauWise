import CodeInput from '@/components/CodeInput';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { auth } from '@/services/auth';
import { sendEmailVerification, verifyEmail } from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	createUserWithEmailAndPassword,
	signInWithCredential,
	signInWithEmailAndPassword,
	updateProfile
} from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { router, useGlobalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ChevronLeft } from 'lucide-react-native';
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
	let { userInfo } = useGlobalSearchParams();
	const [timeLeft, setTimeLeft] = useState(0);
	const [isClick, setIsClick] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	userInfo = userInfo ? JSON.parse(userInfo) : null;

	const {
		control,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
		clearErrors
	} = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			code: ''
		}
	});

	const sendEmailVerifyMutation = useMutation({
		mutationFn: sendEmailVerification,

		onError: (err) => {
			setError('code', { message: err.message });
		},
		onSuccess: (data) => {
			if (errors?.code) {
				clearErrors('code');
			}
			startTimer();
		}
	});

	const verifyEmailMutation = useMutation({
		mutationFn: verifyEmail,
		onSuccess: async ({ result }) => {
			if (!result?.success) {
				throw new Error(result?.message);
			}

			let user;

			if (userInfo?.credential) {
				user = await signInWithCredential(auth, userInfo?.credential);
			} else {
				user = await createUserWithEmailAndPassword(
					auth,
					userInfo?.email,
					userInfo?.password
				);
				await updateProfile(user.user, {
					displayName: userInfo?.name
				});
				await signInWithEmailAndPassword(auth, userInfo?.email, userInfo?.password);
			}

			setModalVisible(true);

			if (user) {
				router.dismissAll();
				router.replace('profiling/index');
				Toast.show({
					type: 'successToast',
					text1: 'Your email is now verified!',
					props: { activeTheme }
				});
				setModalVisible(false);
			}
		},

		onError: (err) => {
			let message;

			if (err.code === 'aborted') {
				message = err.message;
			} else {
				message = 'Something went wrong. Please try again.';
			}
			setError('code', { message });

			console.log(err);

			if (modalVisible) {
				setModalVisible(false);
			}
		}
	});

	const codeInput = watch('code');
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const animationRef = useRef(null);
	const requiredInput = 6;

	const onSubmit = ({ code }) => {
		verifyEmailMutation.mutate({
			code,
			userInfo: {
				email: userInfo.email,
				name: userInfo.name
			}
		});
	};

	const startTimer = () => {
		setTimeLeft((prev) => prev + 20);
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
					Email Verification
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
								Verify Email
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
							disabled={
								timeLeft > 0 ||
								sendEmailVerifyMutation.isPending ||
								verifyEmailMutation.isPending
							}
							onPress={sendCode}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text,
									fontFamily: styles.font.family,
									opacity: verifyEmailMutation.isPending ? 0.5 : 1
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
					visible={modalVisible}
					dismissable={false}
					dismissableBackButton={false}
					contentContainerStyle={{
						alignItems: 'center'
					}}
				>
					<View
						style={{
							padding: styles.spacing.xxl,
							borderRadius: styles.border.radius.size.sm,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							alignItems: 'center',
							rowGap: styles.spacing.sm
						}}
					>
						<Swing size={styles.icon.size.xl} color={styles.theme.colors.primary} />
						<Text
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.regular,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Signing up...
						</Text>
					</View>
				</Modal>
			</Portal>
		</View>
	);
}
