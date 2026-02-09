import { View, Text } from 'react-native';

import {
	Droplets,
	User,
	TriangleAlert,
	FingerprintPattern,
	SunMoon,
	Heart,
	Scissors,
	Wind,
	Droplet,
	CloudSnow
} from 'lucide-react-native';
import Colors from '../../constants/Colors';

import Animated, { FadeIn } from 'react-native-reanimated';

import SingleChoiceQuestion from '@/components/SingleChoiceQuestion';
import MultiSelectQuestion from '@/components/MultiChoiceQuestion';

const icons = [
	{
		color: Colors.primary,
		icon: <User color={Colors.primary} />
	},

	{
		color: '#747eff',
		icon: <Droplets color='#747eff' />
	},

	{
		color: '#ff6a6a',
		icon: <TriangleAlert color='#ff6a6a' />
	},

	{
		color: '#ffb26a',
		icon: <FingerprintPattern color='#ffb26a' />
	},

	{
		color: '#ebb915',
		icon: <SunMoon color='#ebb915' />
	},

	{
		color: '#ff6a6a',
		icon: <Heart color='#ff6a6a' />
	},

	{
		color: Colors.primary,
		icon: <Scissors color={Colors.primary} />
	},

	{
		color: '#24b67c',
		icon: <Wind color='#24b67c' />
	},

	{
		color: '#3b82f6',
		icon: <Droplet color='#3b82f6' />
	},

	{
		color: '#a78bfa',
		icon: <CloudSnow color='#a78bfa' />
	},

	{
		color: '#ff6a6a',
		icon: <Heart color='#ff6a6a' />
	}
];

export default function Questions({ profilingType, questions, step }) {
	return (
		<>
			<Animated.View
				key={`header-${step}`}
				entering={FadeIn.duration(300)}
				collapsable={false}
				style={{
					display: 'flex',
					marginTop: 20,

					paddingBottom: 20
				}}
			>
				<View style={{ display: 'flex', alignItems: 'center', rowGap: 4 }}>
					<View
						style={{
							backgroundColor: icons[step - 1].color + '1A',
							padding: 20,
							borderRadius: 20,
							marginBottom: 12,
							borderWidth: 1,
							borderColor: icons[step - 1].color + '4D'
						}}
					>
						{icons[step - 1].icon}
					</View>

					<Text style={{ fontSize: 30, fontWeight: '900' }}>{profilingType.title}</Text>
					<Text style={{ color: '#6B7280' }}>{profilingType.description}</Text>
				</View>
			</Animated.View>

			<Animated.ScrollView
				key={`scroll-${step}`}
				entering={FadeIn}
				collapsable={false}
				contentContainerStyle={{ padding: 20, rowGap: 25 }}
			>
				{questions.map((question) => {
					return question?.multiSelect ? (
						<MultiSelectQuestion
							key={question.id}
							choiceLabel={question.label}
							options={question.options}
						/>
					) : (
						<SingleChoiceQuestion
							key={question.id}
							choiceLabel={question.label}
							options={question.options}
						/>
					);
				})}
			</Animated.ScrollView>
		</>
	);
}
