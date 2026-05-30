import { View, Text } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import SingleChoiceQuestion from '@/components/SingleChoiceQuestion';
import MultiSelectQuestion from '@/components/MultiChoiceQuestion';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { icons } from '@/constants/IconTheme';
import Colors from '@/constants/Colors';
import { useRef } from 'react';
import SliderQuestion from '@/components/SliderQuestion';

export default function Questions({ profilingType, questions, section, step }) {
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
								padding: 14
							}}
						>
							{icons[step - 1].icon(50, Colors.primary)}
						</View>

						<Text style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: '600' }}>
							{profilingType.title}
						</Text>
						<Text style={{ fontFamily: 'Outfit', color: '#6B7280', textAlign: 'center' }}>
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
						/>
					) : question?.isRange ? (
						<SliderQuestion
							key={question.id}
							choiceLabel={question.label}
							section={section}
							questionIdentifier={question.identifier}
							options={question.options}
							questionId={question.id}
							questionCount={questions.length}
						/>
					) : (
						<SingleChoiceQuestion
							key={question.id}
							choiceLabel={question.label}
							section={section}
							questionIdentifier={question.identifier}
							options={question.options}
							questionId={question.id}
							questionCount={questions.length}
						/>
					);
				})}
			</View>
		</Animated.ScrollView>
	);
}
