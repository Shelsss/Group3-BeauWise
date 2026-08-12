import Google from '@/components/icons/Google';
import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import Logo from '@/components/icons/Logo';
import Input from '@/components/Input';
import { storage } from '@/config/mmkv';
import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { googleSignIn, signIn } from '@/services/auth';
import { useThemeStore } from '@/stores/useThemeStore';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	differenceInSeconds,
	fromUnixTime,
	getMinutes,
	intervalToDuration,
	setMinutes
} from 'date-fns';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Swing } from 'react-native-animated-spinkit';
import { Modal, Portal } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const formSchema = z.object({
	email: z.email({ error: 'Invalid email' }),
	password: z.string().min(2, { error: 'Field is Empty!' })
});

export default function SignIn() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const [remainingTimeAccountLock, setRemainingTimeAccountLock] = useState(null);
	const [remainingAttempts, setRemainingAttempts] = useState(null);
	const [countDown, setCountDown] = useState(null);

	const { control, handleSubmit } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const [isLoading, setIsLoading] = useState(false);
	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const inputPasswordRef = useRef(null);

	const focusNextInput = (inputRef) => () => {
		inputRef?.current?.focus();
	};
	const onSubmit = async (data) => {
		const result = await signIn(data.email, data.password, showModal, hideModal);
		await checkProfilingCompletion();
		const isProfilingCompleted = storage.getBoolean('isProfilingComplete');

		if (!result.success && result.isAccountLock) {
			const lockedUntil = fromUnixTime(result.lockedUntil);

			setRemainingAttempts(null);
			setRemainingTimeAccountLock(lockedUntil);
			return;
		}

		if (!result.success) {
			console.log(result.remainingAttempts);

			setRemainingAttempts(result.remainingAttempts);
			return;
		}

		if (isProfilingCompleted) {
			if (router.canGoBack()) {
				router.back();
			} else {
				router.replace('(tabs)');
			}
		} else {
			router.dismissAll();
			router.replace('profiling');
		}
	};

	const handleGoogleSignIn = async () => {
		const result = await googleSignIn(false, showModal, hideModal).call();

		if (result?.isSignedIn) {
			await checkProfilingCompletion();
			const isProfilingCompleted = storage.getBoolean('isProfilingComplete');

			router.dismissAll();
			if (isProfilingCompleted) {
				router.replace('(tabs)');
			} else router.replace('profiling');
		}
	};

	const onResetPassword = () => {
		router.push('/authentication/password-reset');
	};

	const getCountDown = useCallback(() => {
		const now = new Date();
		const target = remainingTimeAccountLock;

		if (differenceInSeconds(target, now) <= 0) {
			return null;
		}

		const { minutes, seconds } = intervalToDuration({ start: now, end: target });

		return `${minutes ?? 0}:${seconds < 10 ? 0 : ''}${seconds ?? 0}`;
	}, [remainingTimeAccountLock]);

	useEffect(() => {
		if (!remainingTimeAccountLock) return;

		const timer = setInterval(() => {
			const cd = getCountDown();

			if (cd) {
				setCountDown(cd);
			} else {
				setCountDown(null);
				clearInterval(timer);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [remainingTimeAccountLock, countDown]);

	return (
		<>
			<View
				style={{
					flex: 1,
					paddingHorizontal: styles.spacing.xxl,
					justifyContent: 'center'
				}}
			>
				{router.canGoBack() && (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={router.back}
						style={{
							paddingRight: styles.spacing.one_xl,
							position: 'absolute',
							top: 50,
							left: 10
						}}
					>
						<ChevronLeft color={activeTheme === 'dark' ? '#fff' : '#000'} />
					</TouchableOpacity>
				)}

				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: styles.spacing.double_xxl
					}}
				>
					<Logo size={120} />
				</View>

				<View style={{ rowGap: styles.spacing.lg }}>
					<Animated.View>
						<Animated.Text
							style={{
								opacity: countDown ? 1 : 0,
								position: 'absolute',
								transitionDuration: 300,
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors.status.red
							}}
						>
							The account have been locked.{' '}
							<Text style={{ color: styles.theme.colors[activeTheme].text }}>
								Try to sign in after {countDown}
							</Text>
						</Animated.Text>

						<Animated.Text
							style={{
								opacity: remainingAttempts > 0 ? 1 : 0,
								transitionDuration: 300,
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Remaining Attempts:{' '}
							<Text style={{ color: styles.theme.colors.primary }}>
								{remainingAttempts}
							</Text>
						</Animated.Text>
					</Animated.View>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								enterKeyHint='next'
								focusNextInput={focusNextInput(inputPasswordRef)}
								activeTheme={activeTheme}
								label={'Email'}
								placeholder={'Email address'}
								contentType={'email'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							/>
						)}
						name='email'
					/>

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								ref={inputPasswordRef}
								activeTheme={activeTheme}
								label={'Password'}
								isPassword={true}
								placeholder={'Password'}
								contentType={'password'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							/>
						)}
						name='password'
					/>
				</View>

				<TouchableOpacity
					onPress={onResetPassword}
					style={[
						{
							marginTop: styles.spacing.xxl,
							marginRight: styles.spacing.lg,
							alignItems: 'flex-end'
						}
					]}
					activeOpacity={0.7}
				>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.sm,
							fontWeight: styles.font.weight.bold,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Forgot Password?
					</Text>
				</TouchableOpacity>

				<View
					style={{
						rowGap: styles.spacing.one_xl,
						marginTop: styles.spacing.three_xxl
					}}
				>
					<TouchableOpacity
						style={[
							STYLES.button,
							{
								opacity: isLoading ? 0.6 : 1
							}
						]}
						activeOpacity={0.7}
						onPress={handleSubmit(onSubmit)}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.bold,
								color: styles.font.colors._04
							}}
						>
							Sign In
						</Text>
					</TouchableOpacity>

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<View
							style={[
								STYLES.seperator,
								{
									backgroundColor: styles.theme.colors[activeTheme].seperator
								}
							]}
						/>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text_seperator,
								fontSize: styles.font.size.sm
							}}
						>
							OR
						</Text>
						<View
							style={[
								STYLES.seperator,
								{
									backgroundColor: styles.theme.colors[activeTheme].seperator
								}
							]}
						/>
					</View>

					<TouchableOpacity
						onPress={handleGoogleSignIn}
						style={[
							STYLES.button,
							{
								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								columnGap: styles.spacing.lg,
								justifyContent: 'center'
							}
						]}
						activeOpacity={0.7}
					>
						<View>
							<Google size={styles.icon.size.lg} />
						</View>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Continue with Google
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							if (router.canGoBack()) {
								router.back();
							} else {
								router.replace('(tabs)');
							}
						}}
						style={{ alignSelf: 'center', marginTop: styles.spacing.three_xl }}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors.primary,
								fontSize: styles.font.size.lg
							}}
						>
							Continue as Guest
						</Text>
					</TouchableOpacity>

					<View
						style={{
							flexDirection: 'row',
							columnGap: styles.spacing.md,
							alignSelf: 'center',
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								fontSize: styles.font.size.lg,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text + '9a'
							}}
						>
							Don't have an account?
						</Text>

						<TouchableOpacity
							disabled={isLoading}
							onPress={() => router.replace('authentication/sign-up')}
						>
							<Text
								style={{
									fontSize: styles.font.size.lg,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.regular,
									color: styles.theme.colors[activeTheme].text,
									textDecorationLine: 'underline'
								}}
							>
								Sign Up
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<Portal>
				<Modal
					style={{
						marginHorizontal: PagePadding.config.paddingHorizontal
					}}
					visible={visible}
					onDismiss={hideModal}
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
							Signing in...
						</Text>
					</View>
				</Modal>
			</Portal>
		</>
	);
}

const STYLES = StyleSheet.create({
	seperator: {
		width: '40%',
		height: 0.4,

		backgroundColor: styles.background_color._01 + '2a'
	},
	button: {
		paddingVertical: styles.spacing.xxl,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: styles.theme.colors.primary,
		borderRadius: styles.border.radius.size.md
	}
});
