import MailPlus from '@/components/icons/hugeicons/MailPlus';
import styles from '@/config/styles';
import { auth } from '@/services/auth';
import { useThemeStore } from '@/stores/useThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { z } from 'zod';

const formSchema = z.object({
	email: z.email({ error: 'Invalid email' }).refine(
		(val) => {
			return val !== auth.currentUser.email;
		},
		{ error: 'Please enter a new email' }
	)
});

export default function EmailChange() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const { control, handleSubmit } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: ''
		}
	});

	const onSubmit = ({ email }) => {
		router.replace({
			pathname: '/authentication/email-change-verification',
			params: {
				userInfo: JSON.stringify({
					email
				})
			}
		});
	};

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
					Update Email
				</Text>
			</View>

			<Animated.View
				style={{
					padding: styles.spacing.double_xl,
					flex: 1,
					alignItems: 'center',

					marginTop: '8%',
					rowGap: styles.spacing.double_xxl
				}}
			>
				<MailPlus size={styles.icon.size.xl * 4} color={styles.theme.colors.primary} />

				<View style={{ alignItems: 'center' }}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.lg,
							color: styles.theme.colors[activeTheme].text,
							fontWeight: styles.font.weight.semi_bold
						}}
					>
						Update Email Address
					</Text>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text_secondary,
							lineHeight: styles.spacing.double_xxl
						}}
					>
						Your current email address is used for account verification and recovery. If
						you wish to change it, enter your new email address below. For your security,
						we will send a One-Time Password (OTP) to your new email to verify ownership
						before the change takes effect.
					</Text>
				</View>

				<View style={{ rowGap: styles.spacing.sm }}>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							fontWeight: styles.font.weight.semi_bold,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						New Email Address
					</Text>
					<Controller
						name='email'
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => {
							return (
								<Animated.View
									style={{
										borderRadius: styles.border.radius.size.sm,
										backgroundColor: styles.theme.colors[activeTheme].input_background,
										borderWidth: 1,
										borderColor: error
											? styles.theme.colors.status.red
											: styles.theme.colors[activeTheme].input_border,
										flexDirection: 'row',
										alignItems: 'center',
										transitionDuration: 220
									}}
								>
									{error && (
										<Animated.Text
											entering={FadeIn}
											exiting={FadeOut.duration(120)}
											style={{
												fontFamily: styles.font.family,
												color: styles.theme.colors.status.red,
												position: 'absolute',
												fontSize: styles.font.size.sm,
												top: -18,
												right: 8
											}}
										>
											{error.message}
										</Animated.Text>
									)}
									<TextInput
										value={value}
										onChangeText={onChange}
										cursorColor={styles.theme.colors.primary}
										selectionColor={styles.theme.colors.primary}
										selectionHandleColor={styles.theme.colors.primary}
										placeholder={'email@example.com'}
										placeholderTextColor={styles.theme.colors[activeTheme].text_secondary}
										style={{
											paddingLeft: styles.spacing.xxl,
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md,
											color: styles.theme.colors[activeTheme].text,
											width: '100%'
										}}
									/>
								</Animated.View>
							);
						}}
					/>
				</View>
				<TouchableOpacity
					onPress={handleSubmit(onSubmit)}
					activeOpacity={0.7}
					style={{
						width: '100%',

						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.xl,
						backgroundColor: styles.theme.colors.primary,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Animated.View
						layout={LinearTransition.springify().damping(200)}
						style={{
							alignItems: 'center',
							flexDirection: 'row',
							columnGap: styles.spacing.lg
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.semi_bold,
								fontSize: styles.font.size.sm,
								textAlign: 'center'
							}}
						>
							Send Verification Code
						</Text>
					</Animated.View>
				</TouchableOpacity>
			</Animated.View>
		</>
	);
}
