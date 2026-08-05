import CircleCheckFill from '@/components/icons/CircleCheckFill';
import Colors from '@/constants/Colors';
import { FlaskConical, Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Disclaimer from '@/components/learn/ingredients-glossary/Disclaimer';

const mockItem = {
	id: 'retinol',
	info: 'Retinol has low stability in cosmetic formulas due to its high sensitivity to light and temperature, meaning it requires advanced formulation methods (like triple encapsulation) to prevent it from decomposing.',
	is_deleted: false,
	name: 'Retinol',
	categories: ['Active', 'First-Generation Retinoid', 'Anti-Aging'],
	what_it_is:
		'A fat-soluble, natural first-generation retinoid (Vitamin A) and the first vitamin approved by the FDA as an anti-wrinkle agent.',
	what_it_does: [
		'Improves skin texture, dyspigmentation, dryness, and fine lines.',
		'Promotes keratinocyte proliferation, accelerates epidermal turnover, and strengthens the epidermal protective function.',
		'Stimulates fibroblasts to synthesize collagen and elastin fibers, which improves skin elasticity.',
		'Inhibits matrix metalloproteinases (MMPs) to protect existing collagen against degradation.',
		'Reduces skin discoloration by blocking melanin transport and ensuring the proper distribution of melanin in the epidermis.',
		'Reduces transepidermal water loss (TEWL).',
		'Stimulates the synthesis of hyaluronic acid.'
	],
	best_for: [
		'Wrinkles',
		'Photoaging',
		'Melasma',
		'Hyperpigmentation',
		'Dry Skin',
		'Aging Skin'
	],
	common_products: ['Cosmeceutical', 'Anti-Aging Product', 'Emulsion'],
	safety_level:
		'Generally well-tolerated and stable in properly formulated cosmeceutical products. WARNING: Retinol has low stability in cosmetic formulas due to its high sensitivity to light and temperature, meaning it requires advanced formulation methods.',
	sources: [
		'https://pmc.ncbi.nlm.nih.gov/articles/PMC6791161/',
		'https://www.healthline.com/health/beauty-skin-care/what-is-retinol'
	]
};

export default function PageLayout({ item }) {
	return (
		<>
			<View
				style={{
					padding: 20,
					backgroundColor: Colors.primary + '1a',
					borderRadius: 100
				}}
			>
				<FlaskConical color={Colors.primary} />
			</View>
		</>
	);
}

const STYLES = StyleSheet.create({
	category: {
		fontFamily: 'Outfit',
		borderRadius: 100,
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 600,
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: Colors.primary + '1a',
		color: Colors.primary,
		textTransform: 'uppercase'
	}
});
