import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, Circle } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagePadding from '@/constants/PagePadding';
import { Checkbox } from 'expo-checkbox';
import { useRef } from 'react';
import { useProfilingStore } from '@/stores/useProfilingStore';

const initialStepSchema = [
	{
		name: `What We'll Ask`,
		items: [
			'Skin type and environmental responses',
			'Hair pattern, texture, and care routine'
		]
	},

	{
		name: `What We Won't Ask`,
		items: [
			'Medical diagnoses or conditions',
			'Prescription medications or treatments',
			'Health records or sensitive medical data'
		]
	}
];

export default function InitialStep() {
	const { top } = useSafeAreaInsets();
	const scrollViewRef = useRef(null);
	const setIsInitialStepButtonActive = useProfilingStore(
		(state) => state.setIsInitialStepButtonActive
	);

	const isInitialStepButtonActive = useProfilingStore(
		(state) => state.isInitialStepButtonActive
	);

	return (
		<ScrollView
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: PagePadding.config.paddingHorizontal + 20
			}}
		>
			<Animated.View
				entering={FadeInUp.delay(100).duration(200)}
				style={{
					display: 'flex',
					alignItems: 'center',
					marginTop: top + 40,
					marginBottom: 20
				}}
			>
				<Sparkles fill={'#ffffff'} color={Colors.primary} size={48} />
			</Animated.View>

			<Animated.View
				entering={FadeInUp.delay(200).duration(200)}
				style={{ display: 'flex', alignItems: 'center', rowGap: 8 }}
			>
				<Text
					style={{
						fontWeight: '800',
						fontSize: 24,
						color: Colors.primary,
						textAlign: 'center'
					}}
				>
					Let's Personalize Your Experience
				</Text>
				<Text
					style={{
						color: '#6B7280',
						lineHeight: 25
					}}
				>
					Help us understand your unique beauty profile
				</Text>
			</Animated.View>

			<Animated.Text
				entering={FadeInUp.delay(300).duration(200)}
				style={{
					marginTop: 30,
					color: Colors.textColor,
					lineHeight: 20
				}}
			>
				To provide you with a profile-based ingredient analysis, we need to understand
				your general skin and hair traits.
			</Animated.Text>

			<View style={{ rowGap: 20, marginTop: 25 }}>
				<Animated.View entering={FadeInUp.delay(400).duration(100)} style={STYLES.card}>
					<Text style={{ fontWeight: 600, fontSize: 16, color: Colors.textColor }}>
						{initialStepSchema[0].name}
					</Text>
					<View style={{ rowGap: 4 }}>
						{initialStepSchema[0].items.map((item) => (
							<View key={item} style={STYLES.cardItemStyle}>
								<Circle size={6} fill={Colors.primary} strokeWidth={0} />
								<Text style={{ fontSize: 12, color: Colors.textColor }}>{item}</Text>
							</View>
						))}
					</View>
				</Animated.View>

				<Animated.View entering={FadeInUp.delay(500).duration(200)} style={STYLES.card}>
					<Text style={{ fontWeight: 600, fontSize: 16, color: Colors.textColor }}>
						{initialStepSchema[1].name}
					</Text>
					<View style={{ rowGap: 4 }}>
						{initialStepSchema[1].items.map((item) => (
							<View key={item} style={STYLES.cardItemStyle}>
								<Text style={{ fontSize: 12, color: Colors.textColor }}>✗ {item}</Text>
							</View>
						))}
					</View>
				</Animated.View>
			</View>

			<Animated.View
				entering={FadeInUp.delay(600).duration(200)}
				style={{
					backgroundColor: '#e8f5e9',
					padding: 16,
					borderRadius: 16,
					marginTop: 18
				}}
			>
				<Text style={{ fontWeight: 600, color: Colors.textColor }}>
					Medical Disclaimer & Consent:
				</Text>
				<Text
					style={{
						fontSize: 12,
						color: Colors.textColor + '9a'
					}}
				>
					The following questions are designed to estimate general cosmetic compatibility.
					This is not a medical assessment. If you are pregnant, lactating, or have an
					existing diagnosed skin or scalp condition (such as severe acne, atopic
					dermatitis, or psoriasis), please consult your dermatologist before using new
					cosmetic products. The analysis provided by BeauWise may not apply to
					specialized medical conditions.
				</Text>
			</Animated.View>

			<TouchableOpacity
				onPress={() => setIsInitialStepButtonActive(!isInitialStepButtonActive)}
				style={{ flexDirection: 'row', columnGap: 6, marginTop: 20 }}
				activeOpacity={0.5}
			>
				<Checkbox
					value={!isInitialStepButtonActive}
					color={!isInitialStepButtonActive ? Colors.primary : undefined}
					style={{
						aspectRatio: 1,
						width: 15,
						pointerEvents: 'none',
						borderRadius: 4,
						marginTop: 4,
						backgroundColor: '#f9f8f8c4'
					}}
				/>

				<View>
					<Text style={{ fontSize: 12, paddingRight: 20 }}>
						I understand that BeauWise is an educational tool and not a substitute for
						professional medical advice.
					</Text>
				</View>
			</TouchableOpacity>
		</ScrollView>
	);
}

const STYLES = StyleSheet.create({
	card: {
		rowGap: 8,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000000a0',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	},

	cardItemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 6
	}
});
