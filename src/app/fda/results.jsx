import Disclaimer from '@/components/batch/Disclaimer';
import BatchHeader from '@/components/batch/Header';
import CardResult from '@/components/fda/CardResult';
import Colors from '@/constants/Colors';
import { useGlobalSearchParams } from 'expo-router';
import { CircleAlert, CircleCheckBig, CircleQuestionMark } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
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
		headerContent: 'Product is Expired',
		footerContent: (expirationDate) => `Verification Date: ${expirationDate}`,
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

const mockBrandResult = {
	productName:
		'LUXE ORGANIX MAXSHIELD ACTIVE ULTRA SHEER FACE AND BODY COOLING SUNSCREEN',
	companyName: 'CY PACIFIC CONSOLIDATED, INC.',
	validityPeriod: 'December 16, 2026',
	notificationNumber: 'NN-1000012112934'
};

export default function FdaResultsScreen() {
	const params = useGlobalSearchParams();
	const resultType = params?.result;
	const { bottom, top } = useSafeAreaInsets();
	const schema = resultSchema.find((item) => item.type === resultType);

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
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						rowGap: 8
					}}
				>
					<View
						style={{
							backgroundColor: schema.themeColor + '1a',
							borderRadius: 100,
							padding: 16
						}}
					>
						{schema.icon(30, schema.themeColor)}
					</View>

					<Text style={{ color: schema.themeColor, fontWeight: 700, fontSize: 24 }}>
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
							? schema.footerContent(mockBrandResult.validityPeriod)
							: schema.footerContent}
					</Text>
				</View>

				<CardResult resultType={resultType} result={mockBrandResult} />
				<Disclaimer note={resultSchema[3]} color={Colors.primary} />

				<Shadow stretch={true} distance={1} startColor='#0000002f' offset={[0, 1]}>
					<Pressable
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
							Check Another Product
						</Text>
					</Pressable>
				</Shadow>
			</ScrollView>
		</View>
	);
}
