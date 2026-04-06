import { View, Text } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import SingleChoiceQuestion from '@/components/SingleChoiceQuestion';
import MultiSelectQuestion from '@/components/MultiChoiceQuestion';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { icons } from '@/constants/IconTheme';
import Colors from '@/constants/Colors';
import { useRef } from 'react';
export default function Questions({ profilingType, questions, section, step }) {
	const selectedGender = useProfilingStore((state) => state.profile.about_you.gender);
	const scrollViewRef = useRef(null);
	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			showsVerticalScrollIndicator={false}
			key={`scroll-${step}`}
			entering={FadeInDown}
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
								backgroundColor: Colors.primary + '1A',
								padding: 22,
								borderRadius: 24,
								marginBottom: 12,
								borderColor: Colors.primary + '4D'
							}}
						>
							{icons[step - 1].icon(24, Colors.primary)}
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
