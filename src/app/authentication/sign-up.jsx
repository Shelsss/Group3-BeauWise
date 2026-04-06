import Google from '@/components/icons/Google';
import Input from '@/components/Input';
import ToS from '@/components/TermsOfService';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	useBottomSheetModal
} from '@gorhom/bottom-sheet';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { ArrowRight, Info, Lock, Mail, UserRound } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	BackHandler,
	ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { googleSignIn, signUp } from '@/services/auth';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';

const size = 16;

const safetyNoticeSchema = [
	{
		name: 'Educational Tool Only',
		description:
			'BeauWise provides cosmetic ingredient analysis with no approved therapeutic claims.'
	},

	{
		name: 'No Medical Diagnosis',
		description:
			'This system does not treat skin conditions. Do not use it to self-diagnose or self-medicate.'
	},

	{
		name: 'Expert Consultation',
		description: 'Always consult a board-certified dermatologist for medical concerns.'
	},

	{
		name: 'Data Privacy',
		description: 'Your data is handled securely and kept private.'
	}
];
const formSchema = z
	.object({
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
			}),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword']
	});

export default function SignIn() {
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: '',
			userName: '',
			password: '',
			confirmPassword: ''
		}
	});

	const { dismiss } = useBottomSheetModal();
	const { top, bottom } = useSafeAreaInsets();
	const [isOlder, setIsOlder] = useState(false);
	const [isAgreeOnTerms, setIsAgreeOnTerms] = useState(false);
	const [isAgreeOnPrivacy, setIsAgreeOnPrivacy] = useState(false);
	const scrollViewRef = useRef(null);
	const tosRef = useRef(null);
	const privacyPolicyRef = useRef(null);
	const handleValueChange = (isModal, value, setter) => () => {
		setter(!value);
	};

	const handleOpenModal = () => {
		if (isAgreeOnPrivacy && isAgreeOnTerms) {
			setIsAgreeOnPrivacy(!isAgreeOnPrivacy);
			setIsAgreeOnTerms(!isAgreeOnTerms);

			return;
		}

		if (isAgreeOnTerms) {
			privacyPolicyRef.current.present();
			return;
		}

		tosRef.current.present();
	};

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={0.7} disappearsOnIndex={-1} />,
		[]
	);

	useEffect(() => {
		const backAction = () => {
			return dismiss();
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	const onSubmit = async (data) => {
		const isSuccess = await signUp(data.email, data.confirmPassword, data.userName);

		if (!isSuccess) return;

		Toast.show({
			type: 'success',
			text1: 'Account created!'
		});

		router.dismissAll();
		router.replace('profiling');
	};

	const handleGoogleSignIn = async () => {
		const isSignIn = await googleSignIn(true).call();

		const isProfilingCompleted = await checkProfilingCompletion();

		if (!isSignIn) return;

		router.dismissAll();
		if (isProfilingCompleted) {
			router.replace('(tabs)');
		} else router.replace('profiling');
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
					paddingTop: top,
					paddingBottom: bottom,
					paddingHorizontal: PagePadding.config.paddingHorizontal
				}}
			>
				<View style={{ alignItems: 'center', marginBottom: 16 }}>
					<Image
						style={{ aspectRatio: 16 / 9, width: 120 }}
						source={require('assets/images/logo.webp')}
					/>

					<Text style={{ fontSize: 24, fontWeight: 700, color: Colors.primary }}>
						Join Beauwise
					</Text>
				</View>
				<View style={{ rowGap: 20 }}>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								placeholder={'Full Name'}
								contentType={'username'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							>
								<UserRound size={size} color={Colors.textColor + '7a'} />
							</Input>
						)}
						name='userName'
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								placeholder={'Email address'}
								contentType={'email'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							>
								<Mail size={size} color={Colors.textColor + '7a'} />
							</Input>
						)}
						name='email'
					/>

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								isPassword={true}
								placeholder={'Password'}
								contentType={'new-password'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							>
								<Lock size={size} color={Colors.textColor + '7a'} />
							</Input>
						)}
						name='password'
					/>

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								isPassword={true}
								placeholder={'Confirm Password'}
								contentType={'password'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							>
								<Lock size={size} color={Colors.textColor + '7a'} />
							</Input>
						)}
						name='confirmPassword'
					/>
				</View>

				<View style={{ marginVertical: 35, rowGap: 8 }}>
					<TouchableOpacity
						style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}
						onPress={handleValueChange(false, isOlder, setIsOlder)}
						activeOpacity={0.5}
					>
						<Checkbox
							color={isOlder ? Colors.primary : undefined}
							value={isOlder}
							style={{
								aspectRatio: 1,
								width: 15,
								pointerEvents: 'none',
								borderRadius: 4
							}}
						/>

						<View>
							<Text style={{ fontSize: 12 }}>
								I confirm that I am 18 years of age or older
							</Text>
							<Text style={{ fontSize: 10, color: Colors.textColor + '7a' }}>
								BeauWise provides cosmetic analysis that requires adult discretion
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}
						onPress={handleOpenModal}
						activeOpacity={0.5}
					>
						<Checkbox
							color={isAgreeOnPrivacy && isAgreeOnTerms ? Colors.primary : undefined}
							value={isAgreeOnPrivacy && isAgreeOnTerms}
							style={{
								aspectRatio: 1,
								width: 15,
								pointerEvents: 'none',
								borderRadius: 4
							}}
						/>

						<Text style={{ fontSize: 12 }}>
							I have read and agree to the{' '}
							<Text style={{ color: Colors.primary, fontWeight: 500 }}>
								Terms of Service
							</Text>{' '}
							and{' '}
							<Text style={{ color: Colors.primary, fontWeight: 500 }}>
								Privacy Policy
							</Text>
						</Text>
					</TouchableOpacity>
				</View>

				<View
					style={{
						borderRadius: 16,
						rowGap: 10,
						backgroundColor: Colors.primary + '2a',
						padding: 20
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4 }}>
						<Info color={'#20C997'} size={16} />
						<Text style={{ fontWeight: 600, color: Colors.textColor }}>
							Important Safety Notice
						</Text>
					</View>

					<View style={{ rowGap: 20 }}>
						{safetyNoticeSchema.map(({ name, description }) => (
							<Text style={{ fontSize: 12, paddingRight: 30 }} key={name}>
								<Text style={{ fontWeight: 600, color: Colors.textColor }}>{name}: </Text>
								{description}
							</Text>
						))}
					</View>
				</View>

				<View style={{ rowGap: 25, marginTop: 35 }}>
					<TouchableOpacity
						style={[
							STYLES.button,
							{ opacity: isAgreeOnPrivacy && isAgreeOnTerms && isOlder ? 1 : 0.5 }
						]}
						activeOpacity={0.7}
						disabled={(!isAgreeOnPrivacy && !isAgreeOnTerms) || !isOlder}
						onPress={handlePress}
					>
						<Text style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
							Create Account
						</Text>
						<ArrowRight size={14} color={'#fff'} />
					</TouchableOpacity>

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<View style={[STYLES.seperator]} />
						<Text
							style={{
								color: Colors.textColor + '7a',
								textTransform: 'uppercase',
								fontSize: 10
							}}
						>
							or continue with
						</Text>
						<View style={[STYLES.seperator]} />
					</View>

					<TouchableOpacity
						activeOpacity={0.7}
						disabled={(!isAgreeOnPrivacy && !isAgreeOnTerms) || !isOlder}
						onPress={handleGoogleSignIn}
						style={[
							STYLES.button,
							{
								backgroundColor: '#fff',
								columnGap: 20,
								justifyContent: 'center',
								opacity: isAgreeOnPrivacy && isAgreeOnTerms && isOlder ? 1 : 0.5
							}
						]}
					>
						<View>
							<Google />
						</View>

						<Text
							style={{
								fontWeight: 600,
								color: '#4B5563'
							}}
						>
							Sign Up with Google
						</Text>
					</TouchableOpacity>

					<View style={{ flexDirection: 'row', columnGap: 4, alignSelf: 'center' }}>
						<Text
							style={{
								color: Colors.textColor + '7a'
							}}
						>
							Already have an account?
						</Text>

						<TouchableOpacity onPress={() => router.replace('authentication/sign-in')}>
							<Text
								style={{
									fontWeight: 900,
									color: Colors.primary,
									textDecorationLine: 'underline'
								}}
							>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			<BottomSheetModal
				enableOverDrag={false}
				style={STYLES.sheet}
				ref={tosRef}
				snapPoints={['95%']}
				topInset={top - 4}
				backgroundStyle={{
					borderRadius: 16
				}}
				backdropComponent={renderBackdrop}
				handleStyle={{
					padding: 0
				}}
				handleIndicatorStyle={{ display: 'none' }}
			>
				<BottomSheetScrollView showsVerticalScrollIndicator={false}>
					<ToS
						handleClose={() => dismiss()}
						handleAgree={() => {
							privacyPolicyRef.current.present();
							setIsAgreeOnTerms(true);
						}}
					/>
				</BottomSheetScrollView>
			</BottomSheetModal>

			<BottomSheetModal
				stackBehavior='replace'
				enableOverDrag={false}
				style={STYLES.sheet}
				ref={privacyPolicyRef}
				snapPoints={['95%']}
				topInset={top - 4}
				backgroundStyle={{
					borderRadius: 16
				}}
				backdropComponent={renderBackdrop}
				handleStyle={{
					padding: 0
				}}
				handleIndicatorStyle={{ display: 'none' }}
			>
				<BottomSheetScrollView showsVerticalScrollIndicator={false}>
					<PrivacyPolicy
						handleAgree={() => {
							dismiss();
							setIsAgreeOnPrivacy(true);
						}}
					/>
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}

const STYLES = StyleSheet.create({
	seperator: {
		width: '30%',
		height: 0.4,

		backgroundColor: Colors.textColor + '7a'
	},
	button: {
		paddingVertical: 16,
		columnGap: 6,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.primary,
		borderRadius: 16

		// shadowColor: '#000',
		// shadowOffset: {
		// 	width: 0,
		// 	height: 12
		// },
		// shadowOpacity: 0.58,
		// shadowRadius: 16.0,

		// elevation: 24
	},

	sheet: {
		marginHorizontal: PagePadding.config.paddingHorizontal,
		paddingBottom: 200
	}
});
