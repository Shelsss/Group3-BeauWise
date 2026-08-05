import Google from '@/components/icons/Google';
import Input from '@/components/Input';
import ToS from '@/components/TermsOfService';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	BackHandler,
	ScrollView,
	useColorScheme
} from 'react-native';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { googleSignIn, signUp } from '@/services/auth';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { Swing } from 'react-native-animated-spinkit';
import { Modal, Portal } from 'react-native-paper';
import styles from '@/config/styles';
import { onScroll } from '@/utility/scrollView';
import { useThemeStore } from '@/stores/useThemeStore';
import { ChevronLeft } from 'lucide-react-native';
import { storage } from '@/config/mmkv';

const formSchema = z.object({
	userName: z.string().min(2, { error: 'Name is required' }),
	email: z.email({ error: 'Invalid email' }),
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
		})
});

export default function SignIn() {
	const systemTheme = useColorScheme() ?? 'light';

	const themeMode = useThemeStore((state) => state.themeMode);

	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: '',
			userName: '',
			password: ''
		}
	});

	const scrollRef = useRef(null);
	const privacyScrollRef = useRef(null);

	const inputEmailRef = useRef(null);
	const inputPasswordRef = useRef(null);

	const [isOlder, setIsOlder] = useState(false);
	const [isAgreeOnTerms, setIsAgreeOnTerms] = useState(false);
	const [isAgreeOnPrivacy, setIsAgreeOnPrivacy] = useState(false);
	const scrollViewRef = useRef(null);
	const handleValueChange = (isModal, value, setter) => () => {
		setter(!value);
	};

	const [visible, setVisible] = useState(false);
	const [privacyVisible, setPrivacyVisible] = useState(false);
	const [termsServiceVisible, setTermsServiceVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const showPrivacyPolicy = () => setPrivacyVisible(true);
	const hidePrivacyPolicy = () => setPrivacyVisible(false);

	const showTermsService = () => setTermsServiceVisible(true);
	const hideTermsService = () => setTermsServiceVisible(false);

	const handleOpenModal = () => {
		if (isAgreeOnPrivacy && isAgreeOnTerms) {
			setIsAgreeOnPrivacy(!isAgreeOnPrivacy);
			setIsAgreeOnTerms(!isAgreeOnTerms);

			return;
		}

		if (isAgreeOnTerms) {
			showPrivacyPolicy();
			return;
		}

		showTermsService();
	};

	const focusNextInput = (inputRef) => () => {
		inputRef?.current?.focus();
	};

	const onSubmit = async (data) => {
		const result = await signUp(
			data.email,
			data.password,
			data.userName,
			showModal,
			hideModal
		);

		if (result?.isEmailVerificationRequired) {
			return router.push({
				pathname: '/authentication/email-verification',
				params: {
					userInfo: JSON.stringify(result.userInfo)
				}
			});
		}
	};

	const handleGoogleSignIn = async () => {
		const result = await googleSignIn(true, showModal, hideModal).call();

		if (result?.isEmailVerificationRequired) {
			return router.push({
				pathname: '/authentication/email-verification',
				params: {
					userInfo: JSON.stringify(result.userInfo)
				}
			});
		}
	};

	const handlePress = () => {
		scrollViewRef.current.scrollTo({
			x: 0,
			y: 0
		});

		handleSubmit(onSubmit).call();
	};

	return (
		<>
			<ScrollView
				ref={scrollViewRef}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y < 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flex: 1,
					justifyContent: 'center',
					paddingHorizontal: styles.spacing.xxl
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

				<View style={{ alignItems: 'center', marginBottom: styles.spacing.double_xxl }}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.double_xl,
							textAlign: 'center',
							fontWeight: styles.font.weight.extra_bold,
							color: styles.theme.colors.primary
						}}
					>
						Join BeauWise
					</Text>
				</View>
				<View style={{ rowGap: styles.spacing.lg }}>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								focusNextInput={focusNextInput(inputEmailRef)}
								enterKeyHint='next'
								activeTheme={activeTheme}
								label={'Full Name'}
								placeholder={'Full Name'}
								contentType={'username'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							/>
						)}
						name='userName'
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								focusNextInput={focusNextInput(inputPasswordRef)}
								ref={inputEmailRef}
								enterKeyHint='next'
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
								contentType={'new-password'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							/>
						)}
						name='password'
					/>
				</View>

				<View style={{ marginVertical: styles.spacing.double_xl, rowGap: 8 }}>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.md
						}}
						onPress={handleValueChange(false, isOlder, setIsOlder)}
						activeOpacity={0.5}
					>
						<Checkbox
							color={isOlder ? styles.theme.colors.primary : undefined}
							value={isOlder}
							style={{
								aspectRatio: 1,
								width: 14,
								pointerEvents: 'none',
								borderRadius: 2
							}}
						/>

						<View>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								I confirm that I am 18 years of age or older
							</Text>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text + '9a'
								}}
							>
								BeauWise provides cosmetic analysis that requires adult discretion
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.md
						}}
						onPress={handleOpenModal}
						activeOpacity={0.5}
					>
						<Checkbox
							color={
								isAgreeOnPrivacy && isAgreeOnTerms
									? styles.theme.colors.primary
									: undefined
							}
							value={isAgreeOnPrivacy && isAgreeOnTerms}
							style={{
								aspectRatio: 1,
								width: 15,
								pointerEvents: 'none',
								borderRadius: 2
							}}
						/>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							I have read and agree to the{' '}
							<Text
								style={{
									fontFamily: styles.font.family,
									color: Colors.primary,
									fontWeight: styles.font.weight.regular
								}}
							>
								Terms of Service
							</Text>{' '}
							and{' '}
							<Text
								style={{
									fontFamily: styles.font.family,
									color: Colors.primary,
									fontWeight: styles.font.weight.regular
								}}
							>
								Privacy Policy
							</Text>
						</Text>
					</TouchableOpacity>
				</View>

				<View
					style={{ rowGap: styles.spacing.one_xl, marginTop: styles.spacing.three_xxl }}
				>
					<TouchableOpacity
						style={[
							STYLES.button,
							{ opacity: isAgreeOnPrivacy && isAgreeOnTerms && isOlder ? 1 : 0.5 }
						]}
						activeOpacity={0.7}
						disabled={(!isAgreeOnPrivacy && !isAgreeOnTerms) || !isOlder}
						onPress={handlePress}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.bold,
								color: styles.font.colors._04
							}}
						>
							Sign Up
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
						activeOpacity={0.7}
						disabled={(!isAgreeOnPrivacy && !isAgreeOnTerms) || !isOlder}
						onPress={handleGoogleSignIn}
						style={[
							STYLES.button,
							{
								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								columnGap: styles.spacing.lg,
								justifyContent: 'center',
								opacity: isAgreeOnPrivacy && isAgreeOnTerms && isOlder ? 1 : 0.5
							}
						]}
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
							Already have an account?
						</Text>

						<TouchableOpacity onPress={() => router.replace('authentication/sign-in')}>
							<Text
								style={{
									fontSize: styles.font.size.lg,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.regular,
									color: styles.theme.colors[activeTheme].text,
									textDecorationLine: 'underline'
								}}
							>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			<Portal>
				<Modal
					visible={termsServiceVisible}
					dismissable={false}
					dismissableBackButton={true}
				>
					<ScrollView
						ref={scrollRef}
						onScroll={onScroll(scrollRef)}
						style={{
							marginTop: styles.spacing.lg,
							marginHorizontal: styles.spacing.double_xl,
							borderRadius: styles.border.radius.size.sm
						}}
						showsVerticalScrollIndicator={false}
					>
						<ToS
							activeTheme={activeTheme}
							handleClose={hideTermsService}
							handleAgree={() => {
								showPrivacyPolicy();
								hideTermsService();
								setIsAgreeOnTerms(true);
							}}
						/>
					</ScrollView>
				</Modal>
			</Portal>

			<Portal>
				<Modal visible={privacyVisible} dismissable={false} dismissableBackButton={false}>
					<ScrollView
						ref={privacyScrollRef}
						onScroll={onScroll(privacyScrollRef)}
						style={{
							marginTop: styles.spacing.lg,
							marginBottom: styles.spacing.double_xl,
							marginHorizontal: styles.spacing.double_xl,
							borderRadius: styles.border.radius.size.sm
						}}
						showsVerticalScrollIndicator={false}
					>
						<PrivacyPolicy
							activeTheme={activeTheme}
							handleAgree={() => {
								hidePrivacyPolicy();
								setIsAgreeOnPrivacy(true);
							}}
						/>
					</ScrollView>
				</Modal>
			</Portal>

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
							Signing up...
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

		backgroundColor: Colors.textColor + '7a'
	},
	button: {
		paddingVertical: styles.spacing.xxl,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: styles.theme.colors.primary,
		borderRadius: styles.border.radius.size.md
	},

	sheet: {
		marginHorizontal: 6,
		paddingBottom: 200
	}
});
