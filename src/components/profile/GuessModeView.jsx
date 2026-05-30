import Colors from '@/constants/Colors';
import { Circle, UserRound } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateAccountButton from '../CreateAccountButton';
import { router } from 'expo-router';
import Analysis from '@/components/icons/hugeicons/Analysis';
import Transaction from '@/components/icons/hugeicons/Transaction';
import Dashboard from '@/components/icons/hugeicons/Dashboard';
import Robot from '@/components/icons/hugeicons/Robot';
import User from '../icons/hugeicons/User';

const guessModeSchema = {
	accountFeatures: [
		{
			title: 'Personalized Analysis',
			description: 'Tailored skin reports based on your unique profile.',
			icon: (color, size) => <Analysis color={color} size={size} />
		},

		{
			title: 'Full Scan History',
			description: 'Review every analysis and see your progress over time.',
			icon: (color, size) => <Transaction color={color} size={size} />
		},

		{
			title: 'Progress Dashboard',
			description: 'Visualize your skin health improvement trends.',
			icon: (color, size) => <Dashboard color={color} size={size} />
		},

		{
			title: 'Smart Ingredient Matching',
			description: 'AI-powered checks for ingredient compatibility.',
			icon: (color, size) => <Robot color={color} size={size} />
		}
	],

	notAskedFor: [
		`We don't collect sensitive medical information`,
		`We don't require diagnosis or health records`,
		`We don't ask for payment information upfront`,
		`We don't track your location`
	],

	note: 'BeauWise is strictly an educational tool for cosmetic ingredient analysis. It does not diagnose, treat, or replace professional medical advice, and its analyses have no approved therapeutic claims. Always consult a board-certified dermatologist for skin conditions or medical concerns.'
};

export default function GuessModeView() {
	return (
		<View
			style={{
				flex: 1,

				rowGap: 20
			}}
		>
			<View
				style={{
					alignSelf: 'center',
					backgroundColor: Colors.backgroundColor,
					padding: 20,
					borderRadius: 100
				}}
			>
				<User size={50} color={Colors.textColor} />
			</View>

			<View>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 24,
						fontWeight: 700,
						color: Colors.textColor,
						textAlign: 'center'
					}}
				>
					Guest Mode
				</Text>
				<Text
					style={{
						fontFamily: 'Outfit',
						color: Colors.textColor + '9a',
						textAlign: 'center'
					}}
				>
					You're currently using BeauWise as a guest.
				</Text>
			</View>

			<View
				style={[
					{
						padding: 20,
						backgroundColor: Colors.backgroundColor,
						borderRadius: 10,
						rowGap: 14
					},
					STYLES.shadow
				]}
			>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontWeight: 600
					}}
				>
					Unlock Full Features
				</Text>

				<View style={{ rowGap: 24 }}>
					{guessModeSchema.accountFeatures.map(({ title, description, icon }) => (
						<View key={title} style={{ flexDirection: 'row', columnGap: 12 }}>
							<View
								style={{
									marginTop: 4,
									padding: 4,
									borderRadius: 100,
									alignSelf: 'flex-start'
								}}
							>
								{icon('#64748B', 18)}
							</View>

							<View>
								<Text
									style={{
										fontFamily: 'Outfit',
										fontSize: 12,
										fontWeight: 500,
										color: Colors.textColor
									}}
								>
									{title}
								</Text>
								<Text
									style={{
										fontFamily: 'Outfit',
										fontSize: 12,
										color: Colors.textColor + '7a',
										paddingRight: 30
									}}
								>
									{description}
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>
			<CreateAccountButton />

			<TouchableOpacity onPress={() => router.push('authentication/sign-in')}>
				<Text
					style={{ fontFamily: 'Outfit', color: Colors.primary, textAlign: 'center' }}
				>
					Already have an account? Sign In
				</Text>
			</TouchableOpacity>

			{/* <View
				style={[
					{
						backgroundColor: Colors.backgroundColor,
						padding: 20,
						borderRadius: 16,
						rowGap: 8
					},
					STYLES.shadow
				]}
			>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 16,
						fontWeight: 600,
						color: Colors.textColor
					}}
				>
					What We Never Ask For
				</Text>
				{guessModeSchema.notAskedFor.map((item) => (
					<View
						key={item}
						style={{ flexDirection: 'row', columnGap: 6, alignItems: 'center' }}
					>
						<Circle size={6} fill={Colors.textColor + '7a'} strokeWidth={0} />
						<Text style={{ fontFamily: 'Outfit', color: Colors.textColor + '7a' }}>
							{item}
						</Text>
					</View>
				))}
			</View> */}

			<View style={{ backgroundColor: '#E8F5E9', padding: 20, borderRadius: 16 }}>
				<Text
					style={{
						fontFamily: 'Outfit',
						fontSize: 12,
						color: Colors.textColor + '7a',
						lineHeight: 18
					}}
				>
					<Text
						style={{ fontFamily: 'Outfit', fontWeight: 600, color: Colors.textColor }}
					>
						Safety Reminder:{' '}
					</Text>
					{guessModeSchema.note}
				</Text>
			</View>
		</View>
	);
}
const STYLES = StyleSheet.create({
	shadow: {
		shadowColor: '#0000008e',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	}
});
