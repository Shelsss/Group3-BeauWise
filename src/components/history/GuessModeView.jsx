import Colors from '@/constants/Colors';
import { ScrollView, Text, View } from 'react-native';
import CreateAccountButton from '../CreateAccountButton';
import { Check, FolderLock } from 'lucide-react-native';
import PagePadding from '@/constants/PagePadding';
import { useRef } from 'react';

const guessModeSchema = {
	title: 'No Scan History Yet',
	description: `In Guest Mode, your scans are not saved. Create an account to save your history and easily revisit your product safety scores.`,
	accountBenefits: [
		{
			title: 'Save Unlimited Scans',
			description: 'Keep a complete log of all the cosmetics you have analyzed.'
		},

		{
			title: 'Review Safety Scores',
			description: 'Instantly access the chemical breakdown and top irritants.'
		},

		{
			title: 'Personalized Insights',
			description:
				'Get tailored analysis based strictly on your exact skin and hair profile.'
		}
	],
	limitation:
		'In Guest Mode, scans are temporary and cleared when you close the app. Sign up to unlock full history tracking and personalization features.'
};
export default function GuestModeView() {
	const scrollViewRef = useRef(null);
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			contentContainerStyle={{
				paddingHorizontal: 20,
				paddingTop: PagePadding.config.paddingTop + 20,
				paddingBottom: PagePadding.config.paddingBottom
			}}
		>
			<View
				style={{
					backgroundColor: Colors.primary + '2a',
					alignSelf: 'center',
					padding: 30,
					borderRadius: 100
				}}
			>
				<FolderLock size={50} strokeWidth={1.5} color={Colors.primary} />
			</View>

			<View style={{ alignItems: 'center', marginTop: 20 }}>
				<Text style={{ fontSize: 20, fontWeight: 600, color: Colors.textColor }}>
					{guessModeSchema.title}
				</Text>
				<Text
					style={{
						color: Colors.textColor + '9a',
						textAlign: 'center',
						lineHeight: 22,
						width: '80%'
					}}
				>
					{guessModeSchema.description}
				</Text>
			</View>

			<View
				style={{
					rowGap: 20,
					marginVertical: 30
				}}
			>
				{guessModeSchema.accountBenefits.map(({ title, description }) => (
					<View key={title} style={{ flexDirection: 'row', columnGap: 12 }}>
						<View
							style={{
								marginTop: 4,
								backgroundColor: '#20C9971a',
								padding: 4,
								borderRadius: 100,
								alignSelf: 'flex-start'
							}}
						>
							<Check size={12} color={'#20C997'} />
						</View>

						<View>
							<Text style={{ fontWeight: 600, color: Colors.textColor }}>{title}</Text>
							<Text
								style={{ fontSize: 12, color: Colors.textColor + '7a', paddingRight: 30 }}
							>
								{description}
							</Text>
						</View>
					</View>
				))}
			</View>

			<CreateAccountButton />

			<View
				style={{
					backgroundColor: '#e8f5e9',
					padding: 16,
					borderRadius: 16,
					marginTop: 18
				}}
			>
				<Text style={{ fontWeight: 600, color: Colors.textColor }}>
					Guess Mode Limitations
				</Text>
				<Text
					style={{
						fontSize: 12,
						color: Colors.textColor + '9a'
					}}
				>
					{guessModeSchema.limitation}
				</Text>
			</View>
		</ScrollView>
	);
}
