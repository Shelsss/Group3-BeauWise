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
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { useState } from 'react';
import Info from '@/components/icons/Info';
import AnimatedTabs from '@/components/AnimatedTabs';

import { verifyProductByName, verifyProductByNN } from '@/services/fdaApiService';
import { saveHistory } from '@/services/historyService';
import { saveFdaHistory } from '@/services/historyService';
import { useAuthStore } from '@/stores/useAuthStore';

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

	const handleTabChange = (index) => {
		setActiveTab(index);
	};
	const handleQuery = (value) => {
	setQuery(value);
};

const handlePress = async () => {
	if (!query || query.trim() === "") return;

	let resultData = null;
	let resultType = 'invalid';

	const cleanQuery = query.trim();

	try {
		// 🔍 CALL API
		if (activeTab === 0) {
			resultData = await verifyProductByName(cleanQuery);
		} else {
			resultData = await verifyProductByNN(cleanQuery.toUpperCase());
		}

		// 🛑 NO RESULT
		if (!resultData) {
			console.log("NO RESULT FROM API");
			resultType = 'invalid';
		}

	} catch (err) {
		console.log("API ERROR:", err);
		resultData = null;
		resultType = 'invalid';
	}

	// ✅ HANDLE ARRAY RESPONSE (some APIs return array)
	if (Array.isArray(resultData)) {
		resultData = resultData[0];
	}

	// ✅ DETECT VALID / EXPIRED
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

// ✅ SAVE TO FIRESTORE
if (user) {
	await saveFdaHistory(user.uid, {
		productName: resultData?.productName,
		notificationNo: resultData?.notificationNumber,
		result: resultType
	});
}

// 👉 THEN NAVIGATE
router.push({
	pathname: '/fda/results',
	params: {
		result: resultType,
		data: JSON.stringify(resultData)
	}
});
	// ✅ SAFE FIRESTORE SAVE (NO undefined)
	await saveHistory({
		query: cleanQuery,
		type: activeTab === 0 ? 'name' : 'nn',
		resultType: resultType || 'invalid',
		resultData: resultData ?? {}
	});

	// 🚀 NAVIGATE
	router.push({
		pathname: '/fda/results',
		params: {
			result: resultType || 'invalid',
			data: resultData ? JSON.stringify(resultData) : null
		}
	});
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

						paddingHorizontal: 24,
						marginBottom: bottom + 20
					}}
				>
					<Text
						style={{
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

					<Shadow
						stretch={true}
						distance={2}
						startColor='#00000010'
						offset={[0, 1]}
						containerStyle={{
							width: '100%'
						}}
					>
						<View
							style={{
								backgroundColor: Colors.backgroundColor,
								padding: 16,
								borderRadius: 24,
								rowGap: 24
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
										fontSize: 12,
										color: Colors.textColor + '7a',
										width: 260
									}}
								>
									Tip: Enter the exact product name as it appears on the packaging for
									better results.
								</Text>
							</View>

							{/* This should be a primary button component */}

							<Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
								<Pressable
									onPress={handlePress}
									style={{
										columnGap: 12,
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: Colors.primary,
										padding: 16,
										borderRadius: 16
									}}
								>
									<Text
										style={{
											fontSize: 16,
											fontWeight: 600,
											color: Colors.backgroundColor
										}}
									>
										Verify Product
									</Text>
									<CircleCheck size={16} color={Colors.backgroundColor} />
								</Pressable>
							</Shadow>
						</View>
					</Shadow>
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
