import CustomHeader from '@/components/CustomHeader';

import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useCallback, useState } from 'react';
import Card from '@/components/learn/index/Card';
import Animated from 'react-native-reanimated';
import styles from '@/config/styles';
import { router, useFocusEffect } from 'expo-router';
import Book from '@/components/icons/hugeicons/Book';
import ShieldQuestion from '@/components/icons/hugeicons/ShieldQuestion';
import Label2 from '@/components/icons/hugeicons/Label2';
import QuestionMark from '@/components/icons/hugeicons/QuestionMark';
import { useDebouncedCallback } from 'use-debounce';
import { storage } from '@/config/mmkv';
import Disclaimer from '@/components/Disclaimer';

const schema = [
	{
		name: 'Cosmetic Myths & Facts',
		description:
			'Separate evidence-based skincare facts from common beauty misconceptions using scientific and dermatological references.',
		buttonText: 'Read Insights',
		icon: (size, color) => <ShieldQuestion size={size} color={color} />,
		routeTarget: '/learn/myths-facts'
	},
	{
		name: 'A-Z Ingredient Glossary',
		description:
			'Explore scientifically grounded explanations of cosmetic ingredients commonly found in skincare and beauty products.',
		buttonText: 'View Glossary',
		icon: (size, color) => <Book size={size} color={color} />,
		routeTarget: '/learn/ingredients'
	},
	{
		name: 'Cosmetic Label Guide',
		description:
			'Learn how to identify cosmetic packaging symbols, expiration indicators, recycling labels, and safety markings for safer and more informed product decisions.',
		buttonText: 'Decode Labels',
		icon: (size, color) => <Label2 size={size} color={color} />,
		routeTarget: '/learn/cosmetic-guide'
	}
];

const disclaimerSchema = [
	{
		name: 'Educational Resources Disclaimer',
		contents: [
			'The content provided within the Cosmetic Myths and Facts, A-Z Ingredient Glossary, Cosmetic Label Guide, and other educational resources available in BeauWise is intended solely for general educational and informational purposes to support cosmetic literacy and consumer awareness.'
		]
	},

	{
		name: 'Literature-Based Information',
		contents: [
			'Definitions, ingredient descriptions, scientific explanations, regulatory references, and educational fact checks are compiled from publicly available cosmetic science literature, dermatological references, regulatory publications, and industry resources. The information provided is intended to help users better understand cosmetic ingredients and product labeling and should not be interpreted as personalized medical advice, diagnosis, treatment, or professional healthcare guidance.'
		]
	},

	{
		name: 'General Reference Only',
		contents: [
			'Educational content is designed to provide broad explanations and may not address every individual circumstance, product formulation, ingredient interaction, allergy, sensitivity, medical condition, or personal skincare concern. Users should not rely solely on educational content within BeauWise when making healthcare or treatment-related decisions.'
		]
	},
	{
		name: 'Industry and Regulatory Variations',
		contents: [
			'Cosmetic labeling practices, packaging symbols, expiration indicators, certification marks, ingredient naming conventions, recycling labels, and regulatory requirements may vary by manufacturer, country, region, and regulatory authority. The Cosmetic Label Guide is intended as a general reference and cannot guarantee that a particular symbol, label, or claim carries the same meaning across all products or jurisdictions.'
		]
	},
	{
		name: 'Evolving Scientific Knowledge',
		contents: [
			'Cosmetic science, dermatological research, ingredient safety assessments, and regulatory guidance continue to evolve over time. New studies, updated regulations, emerging evidence, and revised industry standards may result in changes to current scientific understanding. While BeauWise strives to maintain accurate and evidence-informed educational content, the completeness, accuracy, or ongoing relevance of all information cannot be guaranteed at all times.'
		]
	},
	{
		name: 'No Medical Advice',
		contents: [
			'The educational resources within BeauWise do not establish a healthcare provider-patient relationship and should not be used as a substitute for consultation with a licensed dermatologist, physician, pharmacist, or other qualified healthcare professional.'
		]
	},
	{
		name: 'Professional Consultation Recommended',
		contents: [
			'If you have a diagnosed skin or scalp condition, known allergies, persistent irritation, unusual skin reactions, are pregnant or breastfeeding, or are considering significant changes to your skincare or haircare routine, consult a licensed dermatologist or qualified healthcare professional before making product-related decisions based on information provided within BeauWise.'
		]
	},
	{
		name: 'User Responsibility',
		contents: [
			'Users remain responsible for evaluating cosmetic products, reviewing official product labeling, following manufacturer instructions, and seeking professional guidance when appropriate. BeauWise educational resources are intended to supplement, not replace, professional judgment and expert consultation.'
		]
	}
];

export default function LearnScreen() {
	const [disclaimerButtonActive, setDisclaimerButtonActive] = useState(true);
	const [disclaimerVisible, setDisclaimerVisible] = useState(false);
	const isShownDisclaimer = storage.getBoolean('learn-disclaimer-shown');

	const showDisclaimer = () => setDisclaimerVisible(true);
	const hideDisclaimer = () => setDisclaimerVisible(false);
	const delayShowDisclaimer = useDebouncedCallback(showDisclaimer, 300);

	const handleDisclaimer = () => {
		hideDisclaimer();

		if (!isShownDisclaimer) {
			storage.set('learn-disclaimer-shown', true);
		}
	};

	const disclaimerDisable = disclaimerButtonActive && !isShownDisclaimer;

	useFocusEffect(
		useCallback(() => {
			if (!isShownDisclaimer) {
				delayShowDisclaimer();
			}
		}, [isShownDisclaimer])
	);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<CustomHeader title={'Learn'} />

				<TouchableOpacity
					onPress={showDisclaimer}
					activeOpacity={0.7}
					style={{
						alignSelf: 'center',
						marginLeft: 'auto',
						position: 'absolute',
						bottom: 36,
						right: 18
					}}
				>
					<QuestionMark
						size={styles.icon.size.xl * 1.4}
						color={styles.background_color._04}
					/>
				</TouchableOpacity>
			</View>

			<Animated.View
				style={{
					...StyleSheet.absoluteFillObject,
					position: 'absolute',
					alignSelf: 'center',
					top: 110,
					rowGap: styles.spacing.one_xxl,
					flex: 1,
					zIndex: 5
				}}
			>
				<View
					style={{
						rowGap: 26
					}}
				>
					{schema.map((item) => (
						<Card
							key={item.name}
							icon={item.icon}
							name={item.name}
							description={item.description}
							onPress={() => router.push(item.routeTarget)}
							buttonText={item.buttonText}
						/>
					))}
				</View>
			</Animated.View>

			<Disclaimer
				schema={disclaimerSchema}
				disclaimerVisible={disclaimerVisible}
				disabled={disclaimerDisable}
				onPress={handleDisclaimer}
				backgroundColor={styles.theme.colors.primary}
				setDisclaimerButtonActive={setDisclaimerButtonActive}
			/>
		</View>
	);
}
