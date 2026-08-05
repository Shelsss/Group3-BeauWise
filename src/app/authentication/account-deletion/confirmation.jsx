import Alert from '@/components/icons/hugeicons/Alert';
import Calendar from '@/components/icons/hugeicons/Calendar';
import styles from '@/config/styles';
import { requestAccountDeletion } from '@/services/cloudFunctions';
import { useThemeStore } from '@/stores/useThemeStore';
import { useBackHandler } from '@react-native-community/hooks';
import { useMutation } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Swing } from 'react-native-animated-spinkit';
import { Modal, Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function AccountDeleteConfirmation() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const [cancelVisible, setCancelVisible] = useState(false);
	const [loadingVisible, setLoadingVisible] = useState(false);

	const getFourteenDays = () => {
		const date = addDays(new Date(), 14);

		return format(date, 'MMM d, yyyy');
	};

	const requestDeletionMutate = useMutation({
		mutationFn: requestAccountDeletion,

		onSuccess: () => {
			setLoadingVisible(false);
		},
		onError: (err) => {
			setLoadingVisible(false);
			Toast.show({
				type: 'errorToast',
				text1: err.message
			});
		}
	});

	const handleConfirm = () => {
		setLoadingVisible((prev) => !prev);
		requestDeletionMutate.mutate();
	};

	const handleCancel = () => {
		setCancelVisible(true);
	};

	useBackHandler(() => {
		if (!loadingVisible) {
			handleCancel();
		}

		return true;
	}, []);

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
				<Text
					style={{
						fontFamily: styles.font.family,
						fontSize: styles.font.size.lg,
						fontWeight: styles.font.weight.bold,
						color: styles.font.colors._04
					}}
				>
					Account Delete Confirmation
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
				<View style={{ alignItems: 'center', rowGap: styles.spacing.lg }}>
					<Alert size={styles.icon.size.xl * 2} color={styles.theme.colors.status.red} />
					<View style={{ rowGap: styles.spacing.lg }}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: styles.font.size.xxl,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Confirm Deactivation
						</Text>
						<Text
							style={{
								textAlign: 'center',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Final step to close your account
						</Text>
					</View>
				</View>

				<View
					style={{
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						borderRadius: styles.border.radius.size.sm,
						overflow: 'hidden'
					}}
				>
					<View style={{ padding: styles.spacing.double_xl, rowGap: styles.spacing.lg }}>
						<View style={{ flexDirection: 'row', columnGap: styles.spacing.lg }}>
							<Calendar color={styles.theme.colors[activeTheme].icon} />

							<View>
								<Text
									style={{
										fontWeight: styles.font.weight.bold,
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									14-Day Grace Period
								</Text>
								<Text
									style={{
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text,
										marginRight: styles.spacing.double_xxl
									}}
								>
									Your data will be held for 14 days before permanent deletion. Logging in
									during this time will cancel the request.
								</Text>
							</View>
						</View>
						<View
							style={{
								borderRadius: styles.border.radius.size.sm,
								borderWidth: activeTheme === 'light' ? 0.5 : 0,
								padding: styles.spacing.xxl,
								flexDirection: 'row',
								backgroundColor: styles.theme.colors[activeTheme].screen_background
							}}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Scheduled Deletion
							</Text>
							<Text
								style={{
									marginLeft: 'auto',
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{getFourteenDays()}
							</Text>
						</View>
					</View>

					<View
						style={{
							width: '100%',
							height: 0.2,
							backgroundColor: styles.theme.colors[activeTheme].seperator
						}}
					/>

					<View style={{ padding: styles.spacing.double_xl, rowGap: styles.spacing.lg }}>
						<TouchableOpacity
							onPress={handleConfirm}
							activeOpacity={0.7}
							style={{
								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.xxl,
								flexDirection: 'row',
								backgroundColor: styles.theme.colors.status.red,

								justifyContent: 'center'
							}}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.font.colors._04
								}}
							>
								Confirm Deactivation
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleCancel}
							activeOpacity={0.7}
							style={{
								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.xxl,
								flexDirection: 'row',
								backgroundColor: activeTheme === 'light' ? '#E2E8F0' : '#0F172A',
								justifyContent: 'center'
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Cancel & Keep Account
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Text
					style={{
						textAlign: 'center',
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text,
						fontSize: styles.icon.size.md
					}}
				>
					By clicking confirm, your access will be immediately revoked across all
					connected devices and platforms.
				</Text>
			</Animated.View>

			<Portal>
				<Modal visible={cancelVisible}>
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
								onPress={() => setCancelVisible(false)}
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

			<Portal>
				<Modal
					visible={loadingVisible}
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
							Deactivating...
						</Text>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
