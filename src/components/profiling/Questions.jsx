import { View, Text, useColorScheme } from 'react-native';

import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import SingleChoiceQuestion from '@/components/SingleChoiceQuestion';
import MultiSelectQuestion from '@/components/MultiChoiceQuestion';
import { useProfilingStore } from '@/stores/useProfilingStore';
import { icons } from '@/constants/IconTheme';
import Colors from '@/constants/Colors';
import { useEffect, useRef } from 'react';
import SliderQuestion from '@/components/SliderQuestion';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import {
	entryScaleHeight,
	entrySlide,
	entrySlideLeft,
	entrySlideRight,
	exitScaleAnimation,
	exitSlide,
	exitSlideLeft,
	exitSlideRight
} from '@/utility/animations';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Questions({ profilingType, questions, section, step }) {
	const params = useLocalSearchParams();
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;
	const scrollViewRef = useRef(null);
	const isEdit = JSON.parse(params?.fromSummary ?? false);
	let slideDirection = useProfilingStore((state) => state.slideDirection);

	const entryAnimation =
		step === 5 || step === 1 || isEdit
			? FadeIn
			: slideDirection === 'forward'
				? entrySlideRight
				: entrySlideLeft;
	const exitAnimation =
		step === 9 || step === 5 || step === 1 || isEdit
			? FadeOut.duration(160)
			: slideDirection === 'forward'
				? exitSlideLeft
				: exitSlideRight;

	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onScroll={({ nativeEvent }) => {
				if (nativeEvent.contentOffset.y < 0) {
					scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
				}
			}}
			style={{
				zIndex: -2
			}}
			showsVerticalScrollIndicator={false}
			key={`scroll-${step}`}
			entering={entryAnimation}
			exiting={exitAnimation}
			contentContainerStyle={{
				paddingTop: 160,
				paddingBottom: 140
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
							{icons[step - 1].icon(
								styles.icon.size.xl * 2.8,
								styles.theme.colors.primary
							)}
						</View>

						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.lg,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{profilingType.title}
						</Text>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md,
								color: styles.theme.colors[activeTheme].text_secondary,
								textAlign: 'center'
							}}
						>
							{profilingType.description}
						</Text>
					</View>
				</Animated.View>

				{questions.map((question) => {
					return question?.multiSelect ? (
						<MultiSelectQuestion
							activeTheme={activeTheme}
							key={question.id}
							choiceLabel={question.label}
							section={section}
							questionIdentifier={question.identifier}
							options={question.options}
						/>
					) : question?.isRange ? (
						<SliderQuestion
							activeTheme={activeTheme}
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
							activeTheme={activeTheme}
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
