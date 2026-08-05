import CodeInput from '@/components/CodeInput';
import Send from '@/components/icons/hugeicons/Send';
import Warn from '@/components/icons/hugeicons/Warn';
import styles from '@/config/styles';
import { auth } from '@/services/auth';
import { sendEmailVerification, verifyEmail } from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBackHandler } from '@react-native-community/hooks';

import { useMutation } from '@tanstack/react-query';

import { router } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { z } from 'zod';

const formSchema = z.object({
	code: z
		.string()
		.min(6, { error: 'Please enter a six-digit code.' })
		.regex(/^\d+$/, { error: 'Please use numbers only.' })
});

export default function AccountDeletionInital() {
	const [modalVisible, setModalVisible] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const sheetRef = useRef(null);
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [timeLeft, setTimeLeft] = useState(0);

	const { dismiss } = useBottomSheetModal();
	const { control, handleSubmit, watch, setError, clearErrors } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			code: ''
		}
	});

	const codeInput = watch('code');

	const onSubmit = ({ code }) => {
		verifyEmailMutation.mutate({
			code,
			userInfo: {
				email: auth.currentUser.email
			}
		});
	};

	const requiredInput = 6;

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
			router.replace('authentication/account-deletion/confirmation');
			dismiss();
		},

		onError: (err) => {
			setError('code', { message: err.message });
		}
	});

	const startTimer = () => {
		setTimeLeft((prev) => prev + 50);
	};

	const handleSendCode = () => {
		sheetRef.current?.present();
		sendEmailVerifyMutation.mutate({
			userInfo: {
				email: auth.currentUser.email
			}
		});
	};

	const handleSheetChange = useCallback((index) => {
		setIsVisible(index !== -1);
	}, []);

	const sendCode = () =>
		sendEmailVerifyMutation.mutate({
			userInfo: {
				email: auth.currentUser.email
			}
		});

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				opacity={1.8}
				disappearsOnIndex={-1}
				pressBehavior='none'
			/>
		),
		[]
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	useBackHandler(() => {
		if (isVisible) {
			setModalVisible(true);
		}

		return isVisible;
	}, [isVisible]);

	useEffect(() => {
		let timer;
		if (isVisible) {
			timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 0) {
						clearInterval(timer);

						return 0;
					}

					return prev - 1;
				});
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [isVisible, sendEmailVerifyMutation.isPending]);
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
					Account Deletion
				</Text>
			</View>

			<Animated.View
				entering={FadeIn.delay(300)}
				exiting={FadeOut}
				style={{
					flex: 1,
					marginTop: styles.spacing.lg,
					padding: styles.spacing.double_xl,
					rowGap: styles.spacing.three_xxl * 1.4
				}}
			>
				<View>
					<Text
						style={{
							fontSize: styles.font.size.one_xl,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Account Deletion Request
					</Text>
					<Text
						style={{
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						Review the consequences before proceeding with your request.
					</Text>
				</View>

				<View
					style={{
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xl,
						borderColor: styles.theme.colors[activeTheme].warn_border,
						borderWidth: 1,
						backgroundColor: styles.theme.colors[activeTheme].warn_background,
						rowGap: styles.spacing.md
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.md
						}}
					>
						<Warn
							size={styles.icon.size.xl}
							color={styles.theme.colors[activeTheme].warn_icon}
						/>
						<Text
							style={{
								fontWeight: styles.font.weight.semi_bold,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].warn_text
							}}
						>
							Critical Action
						</Text>
					</View>

					<View>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].warn_text,
								fontWeight: styles.font.weight.light
							}}
						>
							Deleting your account is a critical action. It will permanently remove your
							user profile, scan history, and all personalized settings. You will have a
							14-day grace period to cancel this request by logging back in.
						</Text>
					</View>
				</View>

				<View style={{ rowGap: styles.spacing.double_xl }}>
					<View>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Identity Verification
						</Text>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text_secondary
							}}
						>
							We will send a 6-digit verification code to your registered email address to
							authorize this request.
						</Text>
					</View>
					<TouchableOpacity
						onPress={handleSendCode}
						activeOpacity={0.7}
						style={{
							backgroundColor: styles.theme.colors.primary,
							padding: styles.spacing.xxl,
							borderRadius: styles.spacing.sm,
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'row',
							columnGap: styles.spacing.sm
						}}
					>
						<Text
							style={{ color: styles.font.colors._04, fontFamily: styles.font.family }}
						>
							Send Verification Code
						</Text>
						<Send color={styles.icon.colors._05} size={styles.icon.size.xl * 1.2} />
					</TouchableOpacity>
				</View>
			</Animated.View>

			<BottomSheetModal
				enablePanDownToClose={false}
				onChange={handleSheetChange}
				animationConfigs={animationConfigs}
				handleComponent={null}
				backgroundStyle={{
					backgroundColor: styles.theme.colors[activeTheme].screen_background,
					borderRadius: styles.border.radius.size.sm
				}}
				ref={sheetRef}
				enableDynamicSizing={true}
				enableBlurKeyboardOnGesture={true}
				backdropComponent={renderBackdrop}
				keyboardBehavior='fillParent'
				keyboardBlurBehavior='restore'
				android_keyboardInputMode='adjustResize'
			>
				<BottomSheetView>
					<View
						style={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: styles.spacing.three_xxl,
							marginHorizontal: styles.spacing.double_xl,
							marginBottom: styles.spacing.three_xxl * 1.4
						}}
					>
						<View
							style={{
								rowGap: styles.spacing.lg,
								alignItems: 'center',
								marginBottom: styles.spacing.xxl
							}}
						>
							<Text
								style={{
									fontSize: styles.font.size.xl,
									fontWeight: styles.font.weight.bold,
									color: styles.theme.colors[activeTheme].text,
									fontFamily: styles.font.family
								}}
							>
								Enter Security Code
							</Text>
							<Text
								style={{
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text,
									fontFamily: styles.font.family,
									textAlign: 'center'
								}}
							>
								We have sent a 6 digit code to your registered email address. Please enter
								it below to securely access your account.
							</Text>
						</View>
						<Controller
							control={control}
							render={({ field: { value: code, onChange }, fieldState: { error } }) => {
								return (
									<View style={{ marginTop: styles.spacing.xxl }}>
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
											isBottomSheet={true}
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
						<TouchableOpacity
							disabled={
								codeInput.length !== requiredInput || verifyEmailMutation.isPending
							}
							onPress={handleSubmit(onSubmit)}
							activeOpacity={0.7}
							style={{
								opacity:
									codeInput.length !== requiredInput || verifyEmailMutation.isPending
										? 0.5
										: 1,
								marginTop: styles.spacing.xxl,
								backgroundColor: styles.theme.colors.primary,
								padding: styles.spacing.xxl,
								borderRadius: styles.spacing.sm,
								alignSelf: 'stretch',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'row',
								columnGap: styles.spacing.md
							}}
						>
							<Text
								style={{
									color: styles.font.colors._04,
									fontFamily: styles.font.family
								}}
							>
								{verifyEmailMutation.isPending ? 'Verifying...' : 'Verify'}
							</Text>

							{verifyEmailMutation.isPending ? (
								<Animated.View entering={FadeIn} exiting={FadeOut.duration(180)}>
									<ActivityIndicator color='#fff' size={styles.icon.size.xl * 1.2} />
								</Animated.View>
							) : (
								<Animated.View entering={FadeIn} exiting={FadeOut.duration(180)}>
									<Check
										color={styles.icon.colors._05}
										size={styles.icon.size.xl * 1.2}
										strokeWidth={1.5}
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
										<Text style={{ color: styles.theme.colors.primary }}>
											{timeLeft}s
										</Text>
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
				</BottomSheetView>
			</BottomSheetModal>

			<Portal>
				<Modal visible={modalVisible}>
					<View
						style={{
							rowGap: styles.spacing.one_xl,
							padding: styles.spacing.one_xxl,
							alignSelf: 'center',
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Are you sure you want to cancel?
						</Text>

						<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									paddingHorizontal: styles.spacing.three_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text style={{ color: styles.theme.colors[activeTheme].text }}>No</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={router.back}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									backgroundColor: styles.theme.colors.primary,
									paddingHorizontal: styles.spacing.one_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.font.colors._04
									}}
								>
									Yes
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
