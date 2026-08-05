import ResetPasswordCode from '@/components/auth/ResetPasswordCode';
import PasswordChange from '@/components/icons/hugeicons/PasswordChange';
import styles from '@/config/styles';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { z } from 'zod';

const formSchema = z.object({
	email: z.email({ error: 'Invalid email address' })
});

export default function PasswordResetInitial() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [codeInputVisible, setCodeInputVisible] = useState(false);
	const {
		control,
		handleSubmit,
		watch,
		setError,
		getValues,
		clearErrors,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: ''
		}
	});

	const onSubmit = () => {
		setCodeInputVisible(true);
	};

	return !codeInputVisible ? (
		<Animated.View
			style={{
				padding: styles.spacing.double_xl
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
					<ChevronLeft
						strokeWidth={1.5}
						color={activeTheme === 'dark' ? '#fff' : '#000'}
					/>
				</TouchableOpacity>
			)}

			<View style={{ marginTop: '46%', rowGap: styles.spacing.three_xxl }}>
				<View style={{ alignItems: 'center', marginBottom: styles.spacing.double_xl }}>
					<PasswordChange
						color={styles.theme.colors.primary}
						size={styles.icon.size.xl * 10}
					/>
				</View>

				<View style={{ rowGap: styles.spacing.md }}>
					<Text
						style={{
							textAlign: 'center',
							fontSize: styles.font.size.xxl,
							fontWeight: styles.font.weight.bold,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Reset Password
					</Text>
					<Text
						style={{
							fontSize: styles.font.size.md,
							textAlign: 'center',
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						Enter your registered email address, and we will send you a verification code
						to reset your password.
					</Text>
				</View>
				<View style={{ width: '100%', rowGap: styles.spacing.three_xxl }}>
					<Controller
						control={control}
						render={({ field: { value: email, onChange }, fieldState: { error } }) => {
							return (
								<Animated.View
									style={{
										paddingHorizontal: styles.spacing.xl,
										borderRadius: styles.border.radius.size.sm,

										backgroundColor: styles.theme.colors[activeTheme].input_background,
										borderWidth: 1,
										borderColor: error
											? styles.theme.colors.status.red
											: styles.theme.colors[activeTheme].input_border,
										transitionDuration: 220
									}}
								>
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

									<TextInput
										placeholder='Email'
										textContentType='emailAddress'
										onChangeText={onChange}
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
										value={email}
										style={{
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md,
											color: styles.theme.colors[activeTheme].text
										}}
									/>
								</Animated.View>
							);
						}}
						name='email'
					/>

					<TouchableOpacity
						onPress={handleSubmit(onSubmit)}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.xl,
							backgroundColor: styles.theme.colors.primary,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
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
							Send Verification Code
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Animated.View>
	) : (
		<ResetPasswordCode email={getValues('email')} />
	);
}
