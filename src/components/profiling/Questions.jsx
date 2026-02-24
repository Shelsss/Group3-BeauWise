import { View, Text } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import SingleChoiceQuestion from '@/components/SingleChoiceQuestion';
import MultiSelectQuestion from '@/components/MultiChoiceQuestion';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { icons } from '@/constants/IconTheme';
export default function Questions({ profilingType, questions, section, step }) {
	const selectedGender = useProfilingStore((state) => state.profile.about_you.gender);

	return (
		<Animated.ScrollView
			key={`scroll-${step}`}
			entering={FadeIn}
			showsVerticalScrollIndicator={false}
			overScrollMode={'never'}
			contentContainerStyle={{
				paddingTop: 30,
				paddingBottom: 30
			}}
		>
			<View
				style={{
					rowGap: 50
				}}
			>
				<Animated.View>
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
							{icons[step - 1].icon(24)}
						</View>

						<Text style={{ fontSize: 26, fontWeight: '900' }}>{profilingType.title}</Text>
						<Text style={{ color: '#6B7280', textAlign: 'center' }}>
							{profilingType.description}
						</Text>
					</View>
				</Animated.View>

				{questions.map((question) => {
					return question?.multiSelect ? (
						<MultiSelectQuestion
							key={question.id}
							choiceLabel={question.label}
							section={section}
							questionIdentifier={question.identifier}
							options={question.options}
							selectedGender={selectedGender}
						/>
					) : (
						<SingleChoiceQuestion
							key={question.id}
							choiceLabel={question.label}
							section={section}
							questionIdentifier={question.identifier}
							options={question.options}
							selectedGender={selectedGender}
							questionId={question.id}
							questionCount={questions.length}
						/>
					);
				})}
			</View>
		</Animated.ScrollView>
	);
}
