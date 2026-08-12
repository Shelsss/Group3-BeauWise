import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { auth, logOut } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	ScrollView
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Lock2 from '../icons/hugeicons/Lock2';
import { useProfilingStore } from '@/stores/useProfilingStore';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import Warn2 from '../icons/hugeicons/Warn2';
import File from '../icons/hugeicons/File';
import Shield from '../icons/hugeicons/Shield';
import Paint from '../icons/hugeicons/Paint';
import Caduceaus from '../icons/hugeicons/Caduceaus';
import Warn from '../icons/hugeicons/Warn';
import AgentSupport from '../icons/hugeicons/AgentSupport';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import Sun from '../icons/hugeicons/Sun';
import Moon from '../icons/hugeicons/Moon';
import Settings from '../icons/hugeicons/Settings';
import PasswordChange from '../icons/hugeicons/PasswordChange';
import Email from '../icons/hugeicons/Email';
import Logout from '../icons/hugeicons/Logout';
import Remove from '../icons/hugeicons/Remove';
import { onScroll } from '@/utility/scrollView';

const themes = [
	{
		value: 'light',
		icon: (size, color) => <Sun size={size} color={color} />
	},
	{
		value: 'dark',
		icon: (size, color) => <Moon size={size} color={color} />
	},
	{
		value: 'system',
		icon: (size, color) => <Settings size={size} color={color} />
	}
];

const settingSchema = [
	{
		title: 'Account',
		hasAuthentication: true,
		isVisible: () => {
			return auth.currentUser?.providerData[0]?.providerId === 'password';
		},
		sets: [
			{
				name: 'Sign In / Create Account',
				action: () => {}
			},
			{
				name: 'Change Password',
				icon: (size, color) => <PasswordChange size={size} color={color} />,
				action: () => {
					router.push('/authentication/password-change');
				}
			},
			{
				name: 'Update Email',
				icon: (size, color) => <Email size={size} color={color} />,
				action: () => {
					router.push('/authentication/email-change');
				}
			}
		]
	},

	{
		title: 'Appearance',

		sets: [
			{
				name: 'Theme',
				icon: (size, color) => <Paint size={size} color={color} />,
				action: (ref) => {
					ref?.current?.present();
				}
			}
		]
	},

	{
		title: 'Danger Zone',
		hasAuthentication: true,
		color: '#ff7a7c',
		sets: [
			{
				name: 'Log Out',
				icon: (size, color) => <Logout size={size} color={color} />,
				action: () => {}
			},
			{
				name: 'Delete Account',
				icon: (size, color) => <Remove size={size} color={color} />,
				action: () => {
					router.push('/authentication/account-deletion/initial');
				}
			}
		]
	},

	{
		title: 'Legal & Support',
		group: 'legal-support',
		sets: [
			{
				name: 'About BeauWise',
				icon: (size, color) => <Warn size={size} color={color} />,
				action: () => router.push('legal-support/about-us')
			},
			{
				name: 'Terms of Service',
				icon: (size, color) => <File size={size} color={color} />,
				action: () => router.push('legal-support/terms-of-service')
			},
			{
				name: 'Privacy Policy',
				icon: (size, color) => <Shield size={size} color={color} />,
				action: () => router.push('legal-support/privacy-policy')
			},

			{
				name: 'Medical Disclaimer',
				icon: (size, color) => <Caduceaus size={size} color={color} />,
				action: () => router.push('legal-support/medical-disclaimer')
			},

			{
				name: 'Contact Support',
				icon: (size, color) => <AgentSupport size={size} color={color} />,
				action: () => router.push('legal-support/contact-support')
			}
		]
	}
];

export default function SettingsView({ isVisible }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const setThemeMode = useThemeStore((state) => state.setThemeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const themeModalRef = useRef(null);
	const scrollRef = useRef(null);

	const renderBackdropComponent = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={0.9} disappearsOnIndex={-1} />,
		[]
	);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const resetProfile = useProfilingStore((state) => state.resetProfile);
	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const handlePress = (name, action, ref) => () => {
		if (name === 'Log Out') {
			showModal();
			return;
		}

		action(ref);
	};

	const handleSignOut = async () => {
		await logOut();
		resetProfile();
		hideModal();
	};

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	return (
		<>
			<ScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				onScroll={onScroll(scrollRef)}
				contentContainerStyle={{
					paddingTop: PagePadding.config.paddingTop,
					paddingBottom: PagePadding.config.paddingBottom,
					paddingHorizontal: PagePadding.config.paddingHorizontal + 10,
					rowGap: 30,

					display: isVisible ? 'flex' : 'none'
				}}
			>
				{!isAuthenticated && (
					<View style={STYLES.container}>
						<Text
							style={[
								STYLES.titleStyle,
								{ color: styles.theme.colors[activeTheme].text }
							]}
						>
							{settingSchema[0].title}
						</Text>
						<View
							style={[
								STYLES.itemContainerStyle,
								{
									borderWidth: 1,
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									borderColor: styles.theme.colors[activeTheme].card_border
								}
							]}
						>
							<View>
								<TouchableOpacity
									onPress={() => router.push('authentication/sign-in')}
									style={[STYLES.itemStyle]}
								>
									<View style={{ marginRight: 8 }}>
										<Lock2
											color={styles.theme.colors[activeTheme].icon + '9a'}
											size={styles.icon.size.lg}
										/>
									</View>

									<Text
										style={[
											STYLES.itemTextStyle,
											{ color: styles.theme.colors[activeTheme].text }
										]}
									>
										Sign In / Create Account
									</Text>
									<ChevronRight
										color={styles.theme.colors[activeTheme].icon}
										size={styles.icon.size.md}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}

				{settingSchema.map(
					({ title, hasAuthentication, color, sets, isVisible }, itemIndex) => {
						if (hasAuthentication && !isAuthenticated) {
							return null;
						}

						if (isVisible !== undefined && !isVisible() && title === 'Account') {
							return null;
						}

						return (
							<View key={title + `-${itemIndex}`} style={STYLES.container}>
								<Text
									style={[
										STYLES.titleStyle,
										{ color: styles.theme.colors[activeTheme].text },
										color && { color: color }
									]}
								>
									{title}
								</Text>
								<View
									style={[
										STYLES.itemContainerStyle,
										{
											borderWidth: 1,
											backgroundColor: styles.theme.colors[activeTheme].card_background,
											borderColor: styles.theme.colors[activeTheme].card_border
										}
									]}
								>
									{sets.map(
										({ name, action, icon }, index) =>
											name !== 'Sign In / Create Account' && (
												<View key={name + `-${index}`}>
													<TouchableOpacity
														onPress={handlePress(name, action, themeModalRef)}
														style={[STYLES.itemStyle]}
													>
														<View style={{ marginRight: 8 }}>
															{icon(
																styles.icon.size.xl,
																styles.theme.colors[activeTheme].icon + '9a'
															)}
														</View>

														<Text
															style={[
																STYLES.itemTextStyle,
																{
																	color: styles.theme.colors[activeTheme].text,
																	textTransform: 'capitalize'
																}
															]}
														>
															{name} {name === 'Theme' && `(${themeMode})`}
														</Text>
														<ChevronRight
															color={styles.theme.colors[activeTheme].icon}
															size={styles.icon.size.md}
														/>
													</TouchableOpacity>
													{index !== sets.length - 1 && (
														<Seperator activeTheme={activeTheme} />
													)}
												</View>
											)
									)}
								</View>
							</View>
						);
					}
				)}

				<Text
					style={{
						color: styles.theme.colors[activeTheme].text_secondary,
						textAlign: 'center',
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family
					}}
				>
					BeauWise Version 1.0.0 {!isAuthenticated && '(Guest Mode)'}
				</Text>
			</ScrollView>
			<Portal>
				<Modal
					style={{
						marginHorizontal: styles.spacing.one_xxl
					}}
					visible={visible}
					onDismiss={hideModal}
					dismissable={false}
					dismissableBackButton={true}
				>
					<View
						style={{
							borderRadius: styles.border.radius.size.sm,
							padding: 20,
							rowGap: 20,
							backgroundColor: styles.theme.colors[activeTheme].card_background
						}}
					>
						<View
							style={{
								padding: 20,
								borderRadius: styles.border.radius.size.sm,
								alignSelf: 'center'
							}}
						>
							<Logout size={styles.icon.size.xl * 2.7} color={'#ff4D4f'} />
						</View>

						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								rowGap: styles.spacing.lg
							}}
						>
							<Text
								style={{
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text,
									fontWeight: styles.font.weight.semi_bold,
									fontSize: styles.font.size.xxl
								}}
							>
								Log Out?
							</Text>
							<Text
								style={{
									lineHeight: 22,
									fontFamily: styles.font.family,
									width: '80%',
									textAlign: 'center',
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text_secondary
								}}
							>
								Are you sure you want to end your current session? You will need to enter
								your email and password again.
							</Text>
						</View>

						<View style={{ rowGap: 10 }}>
							<TouchableOpacity
								onPress={handleSignOut}
								style={{
									backgroundColor: '#ff4D4f',
									paddingVertical: 16,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.font.colors._04,
										fontWeight: styles.font.weight.semi_bold,
										fontSize: styles.font.size.md,
										textAlign: 'center'
									}}
								>
									Log Out
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={hideModal}
								style={{
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].card_background + '4a',
									paddingVertical: 16,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text,
										fontWeight: styles.font.weight.semi_bold,
										fontSize: styles.font.size.md,
										textAlign: 'center'
									}}
								>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</Portal>
			<BottomSheetModal
				backdropComponent={renderBackdropComponent}
				ref={themeModalRef}
				enableDismissOnClose={true}
				animationConfigs={animationConfigs}
				handleComponent={null}
				backgroundStyle={{
					borderRadius: styles.border.radius.size.sm,
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
			>
				<BottomSheetView
					style={{
						paddingBottom: styles.spacing.three_xxl + 10
					}}
				>
					{themes.map(({ value, icon }, index) => (
						<TouchableOpacity
							onPress={() => {
								setThemeMode(value);
							}}
							key={value}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: styles.spacing.double_xxl,
								flex: 1,
								columnGap: styles.spacing.md,
								backgroundColor:
									themeMode === value ? styles.theme.colors.primary_tint : 'transparent'
							}}
						>
							<View>
								{icon(styles.icon.size.lg, styles.theme.colors[activeTheme].icon)}
							</View>

							<Text
								style={{
									color: styles.theme.colors[activeTheme].text,
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									textTransform: 'capitalize',
									textAlign: 'center'
								}}
							>
								{value}
							</Text>
						</TouchableOpacity>
					))}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}

function Seperator({ activeTheme }) {
	return (
		<View
			style={{
				height: 1,
				backgroundColor: styles.theme.colors[activeTheme].card_border
			}}
		/>
	);
}

const STYLES = StyleSheet.create({
	container: {
		rowGap: 6
	},

	titleStyle: {
		fontFamily: styles.font.family,
		fontSize: styles.font.size.md,
		fontWeight: styles.font.weight.bold,
		color: Colors.textColor
	},

	itemContainerStyle: {
		borderRadius: styles.border.radius.size.sm
	},

	itemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16
	},

	itemTextStyle: {
		fontFamily: styles.font.family,
		fontSize: styles.font.size.md,
		fontWeight: styles.font.weight.light,
		color: Colors.textColor,
		marginRight: 'auto'
	}
});
