import Colors from '@/constants/Colors';
import { Circle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const schema = [
	{
		type: 'expired',
		notes: [
			'The FDA Notification validity for this product has expired.',
			`This means the product's authorization for market distribution is no longer active.`,
			'While the product was previously registered, we cannot guarantee its current compliance with safety regulations.',
			'It is recommended to use products with active notifications.'
		]
	},
	{
		type: 'invalid',
		notes: [
			'We could not verify a valid Certificate of Product Notification (CPN) or registered brand name matching your input in the FDA Philippines Database.',
			`Please verify the spelling or try searching via the specific Notification Number (e.g., NN-10000...) found on the packaging.`,
			'Exercise caution, as unverified products may be unregistered, counterfeit, or non-compliant with safety standards.'
		]
	}
];

export default function CardResult({ result, resultType }) {
	if (!result) return null;

	return (
		<Shadow stretch={true} distance={0.5} startColor='#4a4a4a2f' offset={[0, 0.5]}>
			<View
				style={{
					rowGap: 24,
					backgroundColor: Colors.backgroundColor,
					borderRadius: 16,
					padding: 24
				}}
			>
				{/* PRODUCT NAME */}
				<View>
					<Text style={STYLES.cardHeaderTitle}>product name</Text>
					<Text style={STYLES.cardDescription}>
						{(result?.productName || 'No product data found').toUpperCase()}
					</Text>
				</View>

				{resultType === 'valid' ? (
					<CardResultValid result={result} />
				) : (
					<CardResultCommon resultType={resultType} />
				)}
			</View>
		</Shadow>
	);
}

function CardResultCommon({ resultType }) {
	const selected =
		schema.find((item) => item.type === resultType) ||
		schema.find((item) => item.type === 'invalid');

	return (
		<View style={{ rowGap: 12 }}>
			{selected.notes.map((note, index) => (
				<View key={index} style={{ flexDirection: 'row', columnGap: 8 }}>
					<Circle fill={'#000'} size={5} style={{ marginTop: 8 }} />
					<Text style={{ color: Colors.textColor, lineHeight: 20 }}>
						{note}
					</Text>
				</View>
			))}
		</View>
	);
}

function CardResultValid({ result }) {
	return (
		<>
			{/* COMPANY */}
			<View>
				<Text style={STYLES.cardHeaderTitle}>company</Text>
				<Text style={STYLES.cardDescription}>
					{(result.company || '—').toUpperCase()}
				</Text>
			</View>

			{/* VALIDITY */}
			<View>
				<Text style={STYLES.cardHeaderTitle}>validity period</Text>
				<Text style={STYLES.cardDescription}>
					{(result.validity || '—').toUpperCase()}
				</Text>
			</View>

			{/* NOTIFICATION */}
			<View style={{ borderTopWidth: 1, borderTopColor: Colors.textColor + '1a' }}>
				<View style={{ paddingTop: 10 }}>
					<Text style={STYLES.cardHeaderTitle}>notification no.</Text>
					<Text style={STYLES.cardDescription}>
						{(result.notificationNo || '—').toUpperCase()}
					</Text>
				</View>
			</View>
		</>
	);
}

const STYLES = StyleSheet.create({
	cardHeaderTitle: {
		textTransform: 'uppercase',
		color: Colors.textColor + '7a',
		fontWeight: '600'
	},
	cardDescription: {
		color: Colors.textColor,
		fontWeight: '600'
	}
});