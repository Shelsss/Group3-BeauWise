import BatchHeader from '@/components/batch/Header';
import SearchBar from '@/components/SearchBar';
import Fda from '@/components/icons/Fda';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import {
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { useState } from 'react';
import Info from '@/components/icons/Info';
import AnimatedTabs from '@/components/AnimatedTabs';

import { verifyProductByName, verifyProductByNN } from '@/services/fdaApiService';
import { saveHistory, saveFdaHistory } from '@/services/historyService';

import { useAuthStore } from '@/stores/useAuthStore';
import { fdaVerification } from '@/services/cloudFunctions';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native-paper';

const fdaSchema = [
	{
		name: 'Product Name',
		placeholder: 'Enter product name or brand...'
	},
	{
		name: 'Notification No.',
		placeholder: 'Enter NN - code (e.g. NN-12678...)'
	}
];

const status = ['valid', 'invalid', 'expired'];

export default function BatchScreen() {
	const [activeTab, setActiveTab] = useState(0);
	const [query, setQuery] = useState('');
	const router = useRouter();
	const { bottom, top } = useSafeAreaInsets();
	const [activeStatus, setActiveStatus] = useState(false);

	const handleTabChange = (index) => {
		setActiveTab(index);
	};
	const handleQuery = (value) => () => {
		setQuery(value);
	};

	const handlePress = async () => {
		const parsedQuery = query.trim();

		if (!parsedQuery.length) {
			Toast.show({
				type: 'error',
				position: 'bottom',
				text1: 'This field cannot be left blank.'
			});

			return;
		}

		if (parsedQuery[0].toLowerCase().startsWith('n') && activeTab === 0) {
			Toast.show({
				type: 'error',
				position: 'bottom',
				text1: 'Please enter a product name.'
			});

			return;
		}

		if (!parsedQuery[0].toLowerCase().startsWith('n') && activeTab === 1) {
			Toast.show({
				type: 'error',
				position: 'bottom',
				text1: 'Please enter valid notification number.'
			});

			return;
		}

		let resultData = null;
		let resultType = 'invalid';

		// setQuery((prev) => {
		// 	if (parsedQuery[0].toLowerCase().startsWith('n')) {
		// 		console.log('lol');

		// 		return prev
		// 			.trim()
		// 			.toUpperCase()
		// 			.split('')
		// 			.filter((item) => item.trim() !== '')
		// 			.join('');
		// 	}

		// 	return prev.trim();
		// });

		setActiveStatus((prev) => !prev);
		try {
			resultData = await fdaVerification(parsedQuery);

			if (resultData?.error) {
				throw new Error('FDA_SERVER_ERROR');
			}
			if (!resultData) {
				console.log('NO RESULT FROM API');
				resultType = 'invalid';
			}
		} catch (err) {
			setActiveStatus(false);

			if (err.message === 'FDA_SERVER_ERROR') {
				Toast.show({
					type: 'error',
					text1: resultData.error,
					position: 'bottom'
				});
			}

			// console.log('API ERROR:', err);
			// resultData = null;
			// resultType = 'invalid';

			return;
		}

		if (Array.isArray(resultData)) {
			resultData = resultData[0];
		}

		if (resultData) {
			const expiry =
				resultData.NOTIFICATION_VALIDITY ||
				resultData.expiration_date ||
				resultData.validityPeriod;

			if (expiry) {
				const today = new Date();
				const expiryDate = new Date(expiry);

				resultType = expiryDate < today ? 'expired' : 'valid';
			} else {
				resultType = 'valid';
			}
		}
		const user = useAuthStore.getState().user;

		if (user) {
			await saveFdaHistory(user.uid, {
				productName: resultData?.productName,
				notificationNo: resultData?.notificationNumber,
				result: resultType
			});
		}

		router.push({
			pathname: '/fda/results',
			params: {
				result: resultType,
				data: JSON.stringify(resultData)
			}
		});

		await saveHistory({
			query: parsedQuery,
			type: activeTab === 0 ? 'name' : 'nn',
			resultType: resultType || 'invalid',
			resultData: resultData ?? {}
		});

		setActiveStatus(false);
	};

	return (
		<TouchableWithoutFeedback
			touchSoundDisabled={true}
			onPress={Keyboard.dismiss}
			accessible={false}
		>
			<View style={styles.container}>
				<BatchHeader title='FDA Product Verifier' />

				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flex: 1,
						rowGap: 40,

						marginBottom: bottom + 60
					}}
				>
					<Text
						style={{
							fontFamily: 'Outfit',
							paddingTop: top + 10,
							color: Colors.textColor + '7a',
							fontWeight: 400,
							fontSize: 14,
							textAlign: 'center',
							width: 300
						}}
					>
						Check the FDA Philippines Database to ensure your cosmetics are notified and
						safe to use.
					</Text>

					<View>
						<Fda size={250} />
					</View>

					<View
						style={{
							backgroundColor: Colors.backgroundColor,
							paddingTop: 14,
							paddingHorizontal: 20,
							paddingBottom: 20,
							borderRadius: 24,
							rowGap: 24,

							shadowColor: '#000000a1',
							shadowOffset: {
								width: 0,
								height: 1
							},
							shadowOpacity: 0.18,
							shadowRadius: 1.0,

							elevation: 1
						}}
					>
						<AnimatedTabs
							tabs={[fdaSchema[0].name, fdaSchema[1].name]}
							currentIndex={activeTab}
							handleTabChange={handleTabChange}
						/>

						<SearchBar
							handleQuery={handleQuery}
							placeholder={fdaSchema[activeTab].placeholder}
						/>

						<View style={{ flexDirection: 'row' }}>
							<View style={{ marginTop: 3, marginRight: 4 }}>
								<Info size={11} color={Colors.primary} />
							</View>

							<Text
								style={{
									fontFamily: 'Outfit',
									fontSize: 12,
									color: Colors.textColor + '7a',
									width: 260
								}}
							>
								Tip:{' '}
								{activeTab === 0
									? 'Enter the exact product name as it appears on the packaging for better results.'
									: `Enter the exact code including the 'NN-' prefix usually found on the back label.`}
							</Text>
						</View>

						{/* This should be a primary button component */}

						<TouchableOpacity
							activeOpacity={0.5}
							disabled={activeStatus}
							onPress={handlePress}
							style={{
								columnGap: 6,
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: Colors.primary,
								padding: 16,
								borderRadius: 8,
								opacity: activeStatus ? 0.6 : 1
							}}
						>
							{activeStatus ? (
								<ActivityIndicator animating={true} color={'#fff'} />
							) : (
								<>
									<Text
										style={{
											fontFamily: 'Outfit',
											fontSize: 16,
											fontWeight: 600,
											color: Colors.backgroundColor
										}}
									>
										Verify Product
									</Text>
									<CircleCheck size={16} color={Colors.backgroundColor} />
								</>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc'
	}
});
