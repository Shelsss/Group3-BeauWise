import CodeInput from '@/components/CodeInput';
import PrimaryButton from '@/components/PrimaryButton';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { auth } from '@/services/auth';
import {
	sendEmailVerification,
	sendPasswordReset,
	verifyEmail,
	verifyPasswordReset
} from '@/services/cloudFunctions';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';

import { useMutation } from '@tanstack/react-query';
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
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
export default function ResetPasswordCode({ email }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const [timeLeft, setTimeLeft] = useState(0);
	const [isClick, setIsClick] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const { control, handleSubmit, watch, setError, clearErrors } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			code: ''
		}
	});

	const sendPasswordResetMutation = useMutation({
		mutationFn: sendPasswordReset,
		onSuccess: ({ result }) => {
			clearErrors('code');
			startTimer();
		},
		onError: (err) => {
			setError('code', { message: err.message });
		}
	});

	const verifyPasswordResetMutation = useMutation({
		mutationFn: verifyPasswordReset,
		onSuccess: async ({ result }) => {
			if (!result?.success) {
				throw new Error(result?.message);
			}

			router.replace({
				pathname: '/authentication/password-reset-verified',
				params: { email }
			});
		},

		onError: (err) => {
			setError('code', { message: err.message });

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
		verifyPasswordResetMutation.mutate({
			code,
			userInfo: {
				email
			}
		});
	};

	const startTimer = () => {
		setTimeLeft((prev) => prev + 50);
		setIsClick(!isClick);
		animationRef.current?.play();
	};

	const sendCode = () => {
		sendPasswordResetMutation.mutate({
			userInfo: {
				email
			}
		});
	};
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
		<Animated.View
			entering={FadeIn.delay(300).duration(280)}
			exiting={FadeOut}
			style={{ flex: 1, padding: 20, marginTop: '20%' }}
		>
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
					Password Reset Verification
				</Text>
				<Text
					style={{
						fontSize: styles.font.size.md,
						textAlign: 'center',
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text_secondary
					}}
				>
					We've sent a 6-digit verification code to {email}. Please enter the code below.
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
						disabled={
							codeInput.length !== requiredInput || verifyPasswordResetMutation.isPending
						}
						onPress={handleSubmit(onSubmit)}
					>
						{!verifyPasswordResetMutation.isPending && (
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

						{verifyPasswordResetMutation.isPending && (
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
							disabled={timeLeft > 0 || sendPasswordResetMutation.isPending}
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
									!sendPasswordResetMutation.isPending &&
									`Resend code after `}

								{timeLeft <= 0 && !sendPasswordResetMutation.isPending && 'Send Code'}
								{timeLeft > 0 && !sendPasswordResetMutation.isPending && (
									<Text style={{ color: Colors.primary }}>{timeLeft}s</Text>
								)}
							</Text>

							{sendPasswordResetMutation.isPending && (
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
		</Animated.View>
	);
}
