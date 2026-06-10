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
import { UserRound } from 'lucide-react-native';
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
import Lock from '@/components/icons/hugeicons/Lock';
import Mail from '@/components/icons/hugeicons/Mail';
import Logo from '@/components/icons/Logo';
import User from '@/components/icons/hugeicons/User';
import { Swing } from 'react-native-animated-spinkit';
import { Modal, Portal } from 'react-native-paper';

const size = 18;

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

	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

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
		const isSuccess = await signUp(
			data.email,
			data.password,
			data.userName,
			showModal,
			hideModal
		);

		if (!isSuccess) return;

		router.dismissAll();
		router.replace('profiling');
	};

	const handleGoogleSignIn = async () => {
		const isSignIn = await googleSignIn(true, showModal, hideModal).call();

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
					paddingTop: top + 22,
					paddingBottom: bottom,
					paddingHorizontal: PagePadding.config.paddingHorizontal
				}}
			>
				<View style={{ alignItems: 'center', marginBottom: 26 }}>
					<Logo size={100} />

					<Text
						style={{
							fontFamily: 'Outfit',
							fontSize: 20,
							textAlign: 'center',
							fontWeight: 700,
							color: Colors.textColor
						}}
					>
						Find what your skin loves
					</Text>
				</View>
				<View style={{ rowGap: 10 }}>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								label={'Full Name'}
								placeholder={'Full Name'}
								contentType={'username'}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={error}
							>
								<User size={size} color={Colors.textColor + '7a'} />
							</Input>
						)}
						name='userName'
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
							<Input
								label={'Email'}
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
								label={'Password'}
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
				</View>

				<View style={{ marginVertical: 20, rowGap: 8 }}>
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
							<Text style={{ fontFamily: 'Outfit', fontSize: 12 }}>
								I confirm that I am 18 years of age or older
							</Text>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontSize: 10,
									color: Colors.textColor + '7a'
								}}
							>
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

						<Text style={{ fontFamily: 'Outfit', fontSize: 12 }}>
							I have read and agree to the{' '}
							<Text
								style={{ fontFamily: 'Outfit', color: Colors.primary, fontWeight: 500 }}
							>
								Terms of Service
							</Text>{' '}
							and{' '}
							<Text
								style={{ fontFamily: 'Outfit', color: Colors.primary, fontWeight: 500 }}
							>
								Privacy Policy
							</Text>
						</Text>
					</TouchableOpacity>
				</View>

				{/* <View
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
				</View> */}

				<View style={{ rowGap: 14, marginTop: 10 }}>
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
								fontFamily: 'Outfit',
								fontSize: 12,
								fontWeight: 600,
								color: '#fff'
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
						<View style={[STYLES.seperator]} />
						<Text
							style={{
								fontFamily: 'Outfit',
								color: Colors.textColor + '7a',
								fontSize: 11
							}}
						>
							Or sign up with
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
								columnGap: 8,
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
								fontFamily: 'Outfit',
								fontSize: 12,
								fontWeight: 600,
								color: '#4B5563'
							}}
						>
							Google
						</Text>
					</TouchableOpacity>

					<View
						style={{
							marginTop: 8,
							flexDirection: 'row',
							columnGap: 10,
							alignSelf: 'center',
							alignItems: 'center',
							paddingBottom: 8
						}}
					>
						<Text style={{ fontFamily: 'Outfit', color: Colors.textColor + '7a' }}>
							Already have an account?
						</Text>

						<TouchableOpacity
							style={{
								backgroundColor: '#8b78ff2a',
								borderRadius: 8,
								paddingVertical: 8,
								paddingHorizontal: 16
							}}
							onPress={() => router.replace('authentication/sign-in')}
						>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontWeight: 400,
									color: Colors.primary
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
							padding: 18,
							borderRadius: 10,
							backgroundColor: Colors.backgroundColor,
							alignItems: 'center',
							rowGap: 8
						}}
					>
						<Swing size={28} color={Colors.primary} />
						<Text
							style={{
								fontFamily: 'Outfit',
								fontWeight: 500
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
		marginHorizontal: 6,
		paddingBottom: 200
	}
});
