import Google from '@/components/icons/Google';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { googleSignIn, signIn } from '@/services/auth';
import { checkProfilingCompletion } from '@/utility/checkProfilingCompletion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const size = 16;

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

	const onSubmit = async (data) => {
		const isSignIn = await signIn(data.email, data.password);

		const isProfilingCompleted = await checkProfilingCompletion();

		if (!isSignIn) return;

		if (isProfilingCompleted) {
			if (router.canGoBack()) {
				router.back();
			} else {
				router.replace('(tabs)');
			}
		} else router.replace('profiling');
	};

	const handleGoogleSignIn = async () => {
		const isSignIn = await googleSignIn().call();

		const isProfilingCompleted = await checkProfilingCompletion();

		if (!isSignIn) return;

		if (isProfilingCompleted) {
			if (router.canGoBack()) {
				router.back();
			} else {
				router.replace('(tabs)');
			}
		} else router.replace('profiling');
	};

	return (
		<View
			style={{
				flex: 1,
				paddingTop: top,
				paddingHorizontal: PagePadding.config.paddingHorizontal,
				justifyContent: 'center'
			}}
		>
			<View style={{ alignItems: 'center', marginBottom: 16 }}>
				<Image
					style={{ aspectRatio: 16 / 9, width: 200 }}
					source={require('assets/images/logo.webp')}
				/>
			</View>

			<View style={{ rowGap: 20 }}>
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

			<View style={{ rowGap: 25, marginTop: 35 }}>
				<TouchableOpacity
					style={STYLES.button}
					activeOpacity={0.7}
					onPress={handleSubmit(onSubmit)}
				>
					<Text style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Sign In</Text>
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
					onPress={handleGoogleSignIn}
					style={[
						STYLES.button,
						{ backgroundColor: '#fff', columnGap: 20, justifyContent: 'center' },
						STYLES.shadow
					]}
					activeOpacity={0.7}
				>
					<View>
						<Google />
					</View>

					<Text
						style={{
							fontSize: 14,
							fontWeight: 600,
							color: '#4B5563'
						}}
					>
						Sign in with Google
					</Text>
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', columnGap: 4, alignSelf: 'center' }}>
					<Text
						style={{
							color: Colors.textColor + '7a'
						}}
					>
						Don't have an account?
					</Text>

					<TouchableOpacity onPress={() => router.push('authentication/sign-up')}>
						<Text
							style={{
								fontWeight: 900,
								color: Colors.primary,
								textDecorationLine: 'underline'
							}}
						>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
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
