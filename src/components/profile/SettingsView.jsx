import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { logOut } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { ChevronRight, LockKeyhole, LogOut } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	BackHandler,
	useWindowDimensions
} from 'react-native';

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
	const { height } = useWindowDimensions();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const modalRef = useRef(null);
	const { dismiss } = useBottomSheetModal();

	const handlePress = (name, action) => () => {
		if (name === 'Log Out') {
			modalRef.current.present();
			return;
		}

		action.call();
	};

	const handleSignOut = async () => {
		await logOut();
		dismiss();
	};

	useEffect(() => {
		const backAction = () => {
			return dismiss();
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				pressBehavior={'none'}
				{...props}
				opacity={0.7}
				disappearsOnIndex={-1}
			/>
		),
		[]
	);

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
									<LockKeyhole
										color={Colors.textColor}
										size={14}
										style={{ marginRight: 8 }}
									/>
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

				<Text style={{ color: Colors.textColor + '7a', textAlign: 'center' }}>
					BeauWise Version 1.0.0 {!isAuthenticated && '(Guest Mode)'}
				</Text>
			</View>

			<BottomSheetModal
				backdropComponent={renderBackdrop}
				containerStyle={{ marginHorizontal: PagePadding.config.paddingHorizontal }}
				backgroundStyle={{
					borderRadius: 20
				}}
				detached={true}
				bottomInset={height - 550}
				enableDynamicSizing={true}
				ref={modalRef}
				handleIndicatorStyle={{
					display: 'none'
				}}
				enableOverDrag={false}
				enablePanDownToClose={false}
			>
				<BottomSheetView
					style={{
						paddingHorizontal: 12,
						paddingBottom: 14,
						rowGap: 20
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
						<Text style={{ color: '#000', fontWeight: 700, fontSize: 24 }}>
							Log Out of BeauWise?
						</Text>
						<Text
							style={{
								lineHeight: 24,

								width: '80%',
								textAlign: 'center',
								fontSize: 12,
								color: Colors.textColor + '7a'
							}}
						>
							Are you sure you want to end your current session? You will need to enter
							your email and password to access your profile, scan history, and
							personalized recommendations again.
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
									color: '#fff',
									textAlign: 'center',
									fontWeight: 600
								}}
							>
								Log Out
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => dismiss()}
							style={{
								backgroundColor: '#3e3579' + '1a',
								paddingVertical: 16,
								borderRadius: 10
							}}
						>
							<Text
								style={{
									color: '#000',
									fontWeight: 600,

									textAlign: 'center'
								}}
							>
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
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
		fontSize: 16,
		fontWeight: '400',
		color: Colors.textColor,
		marginRight: 'auto'
	}
});
