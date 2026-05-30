import Google from '@/components/icons/Google';
import Lock from '@/components/icons/hugeicons/Lock';
import Mail from '@/components/icons/hugeicons/Mail';
import Logo from '@/components/icons/Logo';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { googleSignIn, signIn } from '@/services/auth';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fold, Swing } from 'react-native-animated-spinkit';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const size = 18;

const formSchema = z.object({
	email: z.email({ error: 'Invalid email' }),
	password: z.string().min(2, { error: 'Field is Empty!' })
});

export default function SignIn() {
	const { top } = useSafeAreaInsets();
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

	const onSubmit = async (data) => {
		const isSignIn = await signIn(data.email, data.password, showModal, hideModal);

		const isProfilingCompleted = await checkProfilingCompletion();

		if (!isSignIn) {
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
		const isSignIn = await googleSignIn(false, showModal, hideModal).call();

		const isProfilingCompleted = await checkProfilingCompletion();

		if (!isSignIn) return;

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
	return (
		<>
			<TouchableOpacity
				onPress={() => {
					if (router.canGoBack()) {
						router.back();
					} else {
						router.replace('(tabs)');
					}
				}}
				style={{ marginLeft: 16, position: 'absolute', top: top + 6 }}
			>
				<Text style={{ fontFamily: 'Outfit', color: Colors.primary }}>
					Continue as Guest
				</Text>
			</TouchableOpacity>
			<View
				style={{
					flex: 1,
					paddingTop: top,
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					justifyContent: 'center'
				}}
			>
				<View
					style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
				>
					<Logo size={120} />
				</View>

				<View style={{ rowGap: 10 }}>
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
								contentType={'password'}
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

				<View style={{ rowGap: 14, marginTop: 35 }}>
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
								fontFamily: 'Outfit',
								fontSize: 12,
								fontWeight: 600,
								color: '#fff'
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
						<View style={[STYLES.seperator]} />
						<Text
							style={{
								fontFamily: 'Outfit',
								color: Colors.textColor + '7a',
								fontSize: 11
							}}
						>
							Or sign in with
						</Text>
						<View style={[STYLES.seperator]} />
					</View>

					<TouchableOpacity
						onPress={handleGoogleSignIn}
						style={[
							STYLES.button,
							{
								backgroundColor: '#fff',
								columnGap: 8,
								justifyContent: 'center'
							},
							STYLES.shadow
						]}
						activeOpacity={0.7}
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
							alignItems: 'center'
						}}
					>
						<Text style={{ fontFamily: 'Outfit', color: Colors.textColor + '7a' }}>
							Don't have an account?
						</Text>

						<TouchableOpacity
							disabled={isLoading}
							style={{
								backgroundColor: '#8b78ff2a',
								borderRadius: 8,
								paddingVertical: 8,
								paddingHorizontal: 16
							}}
							onPress={() => router.replace('authentication/sign-up')}
						>
							<Text
								style={{
									fontFamily: 'Outfit',
									fontWeight: 400,
									color: Colors.primary
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
		borderRadius: 10
	},

	shadow: {
		shadowColor: '#00000082',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	}
});
