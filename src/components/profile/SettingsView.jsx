import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { logOut } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

import { router } from 'expo-router';
import { ChevronRight, LockKeyhole, LogOut } from 'lucide-react-native';
import { useState } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Lock2 from '../icons/hugeicons/Lock2';
import { useProfilingStore } from '@/stores/useProfilingStore';

const settingSchema = [
	{
		title: 'Account',
		hasAuthentication: true,
		sets: [
			{
				name: 'Sign In / Create Account',
				action: () => {}
			},
			{
				name: 'Change Password',
				action: () => {}
			},
			{
				name: 'Update Email',
				action: () => {}
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
				action: () => {}
			},
			{
				name: 'Delete Account',
				action: () => {}
			}
		]
	},

	{
		title: 'Legal & Support',
		group: 'legal-support',
		sets: [
			{
				name: 'Terms of Service',
				action: () => router.push('legal-support/terms-of-service')
			},
			{
				name: 'Privacy Policy',
				action: () => router.push('legal-support/privacy-policy')
			},
			{
				name: 'About Us',
				action: () => router.push('legal-support/about-us')
			},

			{
				name: 'Medical Disclaimer',
				action: () => router.push('legal-support/medical-disclaimer')
			},

			{
				name: 'Contact Support',
				action: () => router.push('legal-support/contact-support')
			}
		]
	}
];

export default function SettingsView({ isVisible }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const resetProfile = useProfilingStore((state) => state.resetProfile);
	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const handlePress = (name, action) => () => {
		if (name === 'Log Out') {
			showModal();
			return;
		}

		action.call();
	};

	const handleSignOut = async () => {
		await logOut();
		resetProfile();
		hideModal();
	};

	return (
		<>
			<View
				style={{
					flex: 1,
					paddingTop: PagePadding.config.paddingTop,
					paddingBottom: PagePadding.config.paddingBottom,
					paddingHorizontal: PagePadding.config.paddingHorizontal + 10,
					rowGap: 30,

					display: isVisible ? 'flex' : 'none'
				}}
			>
				{!isAuthenticated && (
					<View style={STYLES.container}>
						<Text style={[STYLES.titleStyle]}>{settingSchema[0].title}</Text>
						<View style={STYLES.itemContainerStyle}>
							<View>
								<TouchableOpacity
									onPress={() => router.push('authentication/sign-in')}
									style={[STYLES.itemStyle]}
								>
									<View style={{ marginRight: 8 }}>
										<Lock2 color={Colors.textColor} size={14} />
									</View>

									<Text style={[STYLES.itemTextStyle]}>Sign In / Create Account</Text>
									<ChevronRight size={14} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}

				{settingSchema.map(({ title, hasAuthentication, color, sets }, itemIndex) => {
					if (hasAuthentication && !isAuthenticated) {
						return null;
					}

					return (
						<View key={title + `-${itemIndex}`} style={STYLES.container}>
							<Text style={[STYLES.titleStyle, color && { color: color }]}>{title}</Text>
							<View style={STYLES.itemContainerStyle}>
								{sets.map(
									({ name, action }, index) =>
										name !== 'Sign In / Create Account' && (
											<View key={name + `-${index}`}>
												<TouchableOpacity
													onPress={handlePress(name, action)}
													style={[STYLES.itemStyle]}
												>
													<Text style={[STYLES.itemTextStyle, color && { color: color }]}>
														{name}
													</Text>
													<ChevronRight size={14} />
												</TouchableOpacity>
												{index !== sets.length - 1 && <Seperator />}
											</View>
										)
								)}
							</View>
						</View>
					);
				})}

				<Text
					style={{
						color: Colors.textColor + '7a',
						textAlign: 'center',
						fontFamily: 'Outfit'
					}}
				>
					BeauWise Version 1.0.0 {!isAuthenticated && '(Guest Mode)'}
				</Text>
			</View>

			<Portal>
				<Modal
					style={{
						marginHorizontal: PagePadding.config.paddingHorizontal
					}}
					visible={visible}
					onDismiss={hideModal}
					dismissable={false}
					dismissableBackButton={true}
				>
					<View
						style={{
							borderRadius: 20,
							padding: 20,
							rowGap: 20,
							backgroundColor: Colors.backgroundColor
						}}
					>
						<View
							style={{
								backgroundColor: '#ff4D4f1a',
								padding: 20,
								borderRadius: 40,
								alignSelf: 'center'
							}}
						>
							<LogOut size={28} color={'#ff4D4f'} />
						</View>

						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Text
								style={{
									fontFamily: 'Outfit',
									color: '#000',
									fontWeight: 700,
									fontSize: 24
								}}
							>
								Log Out of BeauWise?
							</Text>
							<Text
								style={{
									lineHeight: 22,
									fontFamily: 'Outfit',
									width: '80%',
									textAlign: 'center',
									fontSize: 12,
									color: Colors.textColor + '7a'
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
									borderRadius: 10
								}}
							>
								<Text
									style={{
										fontFamily: 'Outfit',
										color: '#fff',
										textAlign: 'center',
										fontWeight: 600
									}}
								>
									Log Out
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={hideModal}
								style={{
									backgroundColor: '#3e3579' + '1a',
									paddingVertical: 16,
									borderRadius: 10
								}}
							>
								<Text
									style={{
										fontFamily: 'Outfit',
										color: '#000',
										fontWeight: 600,

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
		</>
	);
}

function Seperator() {
	return <View style={{ height: 1, backgroundColor: Colors.textColor + '1a' }} />;
}

const STYLES = StyleSheet.create({
	container: {
		rowGap: 6
	},

	titleStyle: {
		fontFamily: 'Outfit',
		fontSize: 18,
		fontWeight: '600',
		color: Colors.textColor
	},

	itemContainerStyle: {
		borderRadius: 16,
		backgroundColor: Colors.backgroundColor,
		shadowColor: '#000000b8',
		shadowOffset: {
			width: 0,
			height: 0.5
		},
		shadowOpacity: 0.15,
		shadowRadius: 1.0,
		elevation: 1
	},

	itemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16
	},

	itemTextStyle: {
		fontFamily: 'Outfit',
		fontSize: 16,
		fontWeight: '400',
		color: Colors.textColor,
		marginRight: 'auto'
	}
});
