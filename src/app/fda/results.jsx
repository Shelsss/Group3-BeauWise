import Disclaimer from '@/components/batch/Disclaimer';
import BatchHeader from '@/components/batch/Header';
import CardResult from '@/components/fda/CardResult';
import Colors from '@/constants/Colors';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { CircleAlert, CircleCheckBig, CircleQuestionMark } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

// ✅ Helper: format date nicely
const formatDate = (date) => {
	if (!date) return '—';

	try {
		// Handle "21 August 2026"
		const parts = date.split(' ');

		if (parts.length === 3) {
			const [day, month, year] = parts;
			const formatted = new Date(`${month} ${day}, ${year}`);

			return formatted
				.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})
				.toUpperCase();
		}

		// fallback
		return new Date(date)
			.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})
			.toUpperCase();

	} catch {
		return date.toUpperCase();
	}
};

const resultSchema = [
	{
		type: 'valid',
		headerContent: 'Valid',
		footerContent: 'This product is registered with the FDA.',
		icon: (size, color) => <CircleCheckBig color={color} size={size} />,
		themeColor: '#20c997'
	},
	{
		type: 'expired',
		headerContent: 'Notification Expired',
		footerContent: (expirationDate) =>
			`Verification Date: ${formatDate(expirationDate)}`,
		icon: (size, color) => <CircleAlert color={color} size={size} />,
		themeColor: '#ff7a7c'
	},
	{
		type: 'invalid',
		headerContent: 'No Record Found',
		footerContent: `We couldn't find a matching record in the database.`,
		icon: (size, color) => <CircleQuestionMark color={color} size={size} />,
		themeColor: '#ffc53d'
	},
	{
		title: 'Disclaimer',
		message: `The FDA Product Verifier cross-references data from the FDA Philippines Verification Portal. While we strive for accuracy, recent updates to the official database may take time to reflect. This tool validates regulatory status, not dermatological efficacy.`
	}
];

export default function FdaResultsScreen() {
	const params = useGlobalSearchParams();
	const router = useRouter();
	let resultType = params?.result ?? 'invalid';

	console.log("DEBUG resultType:", resultType);

	let rawData = null;

	try {
		rawData = params?.data ? JSON.parse(params.data) : null;
	} catch (e) {
		console.log("JSON parse error:", e);
		rawData = null;
	}

	// ✅ 🔥 MAP FDA DATA HERE (IMPORTANT FIX)
	const fda = rawData?.results || null;

// 🚨 FORCE INVALID IF NO RESULTS
if (!fda) {
	resultType = 'invalid';
}

const resultData = fda
	? {
			productName:
				fda.PRODUCT_NAME ||
				fda.product_name ||
				'Unknown Product',

			company:
				fda.COMPANY_NAME ||
				fda.company_name ||
				'Unknown Company',

			notificationNo:
				fda.ACCOUNTCODE || // 🔥 IMPORTANT (FDA uses this!)
				fda.NOTIFICATION_NO ||
				'—',

			validity: 
				fda.NOTIFICATION_VALIDITY ||
				fda.expiration_date ||
				null
	  }
	: null;

	const { bottom, top } = useSafeAreaInsets();

	const schema =
		resultSchema.find((item) => item.type === resultType) ||
		resultSchema.find((item) => item.type === 'invalid');

	if (!schema) {
		return <Text>Something went wrong</Text>;
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f8fafc', paddingBottom: bottom + 10 }}>
			<BatchHeader title='Verification Result' />

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 24,
					paddingTop: top + 10,
					rowGap: 28
				}}
			>
				{/* 🔝 HEADER */}
				<View style={{ justifyContent: 'center', alignItems: 'center', rowGap: 8 }}>
					<View
						style={{
							backgroundColor: schema.themeColor + '1a',
							borderRadius: 100,
							padding: 16
						}}
					>
						{schema.icon(30, schema.themeColor)}
					</View>

					<Text style={{ color: schema.themeColor, fontWeight: '700', fontSize: 24 }}>
						{schema.headerContent}
					</Text>

					<Text
						style={{
							color: Colors.textColor,
							lineHeight: 20,
							fontSize: 14,
							textAlign: 'center'
						}}
					>
						{typeof schema.footerContent === 'function'
							? schema.footerContent(resultData?.validity)
							: schema.footerContent}
					</Text>
				</View>

				{/* 📦 RESULT CARD */}
				<CardResult resultType={resultType} result={resultData} />

				{/* ⚠️ DISCLAIMER */}
				<Disclaimer note={resultSchema[3]} color={Colors.primary} />

				{/* 🔁 BUTTON */}
				<Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
					<Pressable
						onPress={() => router.back()}
						style={{
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
								fontWeight: '600',
								color: Colors.backgroundColor
							}}
						>
							Check Another Product
						</Text>
					</Pressable>
				</Shadow>
			</ScrollView>
		</View>
	);
}