import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { memo, useState } from 'react';
import Edit2 from '@/components/icons/hugeicons/Edit2';
import styles from '@/config/styles';
import { ChevronDown } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { entrySpringDown, exitSpringUp } from '@/utility/animations';

function EditCard({
	onEdit,
	section,
	label,
	iconProp,
	questions,
	activeTheme,
	profileData
}) {
	const [visible, setVisible] = useState(false);

	const current = questions.find((item) => item.section === section);

	return (
		<View style={{ padding: styles.spacing.lg }}>
			<TouchableOpacity
				onPress={() => setVisible((prev) => !prev)}
				style={{
					display: 'flex',
					flexDirection: 'row',

					alignItems: 'center'
				}}
			>
				<View style={[STYLES.iconStyle]}>{iconProp}</View>
				<Text
					style={{
						fontSize: styles.font.size.md,
						fontWeight: styles.font.weight.semi_bold,
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text
					}}
				>
					{label}
				</Text>
				<Animated.View
					style={{
						marginLeft: 'auto',
						marginRight: styles.spacing.lg,
						transform: [{ rotateZ: visible ? '180deg' : '0deg' }],
						transitionDuration: 220,
						transitionProperty: 'transform'
					}}
				>
					<ChevronDown
						strokeWidth={1.5}
						color={styles.theme.colors[activeTheme].icon}
						size={styles.icon.size.xl}
					/>
				</Animated.View>
			</TouchableOpacity>

			{visible && (
				<Animated.View
					exiting={exitSpringUp}
					entering={entrySpringDown}
					style={{
						marginTop: styles.spacing.xl,
						padding: styles.spacing.xl,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						borderRadius: styles.border.radius.size.sm,
						rowGap: styles.spacing.double_xl
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={{
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md
							}}
						>
							{current.description}
						</Text>
						<TouchableOpacity
							onPress={onEdit}
							style={{ marginLeft: 'auto', marginRight: styles.spacing.md }}
						>
							<Edit2
								color={styles.theme.colors.primary}
								size={styles.icon.size.xl * 1.2}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ rowGap: styles.spacing.double_xl }}>
						{current.questions.map((question) => {
							const answers = Array.isArray(profileData[section][question.identifier])
								? question.options
										.filter((option) =>
											profileData[section][question.identifier].includes(option.value)
										)
										.map((option) => option.label)
								: question.options.find(
										(option) => option.value === profileData[section][question.identifier]
									).label;

							return (
								<View key={question.identifier} style={{ rowGap: styles.spacing.md }}>
									<Text
										style={{
											color: styles.theme.colors[activeTheme].text_secondary,
											fontFamily: styles.font.family,
											fontSize: styles.font.size.md
										}}
									>
										{question.label}
									</Text>

									<View
										style={{
											rowGap: styles.spacing.xl
										}}
									>
										{Array.isArray(answers) ? (
											answers.map((val) => {
												return (
													<Text
														key={val}
														style={{
															paddingVertical: styles.spacing.xs,
															paddingHorizontal: styles.spacing.double_xl,
															backgroundColor: styles.theme.colors.primary,
															borderRadius: styles.border.radius.size.pill,
															fontFamily: styles.font.family,
															fontSize: styles.font.size.sm,
															alignSelf: 'baseline',
															color: styles.font.colors._04
														}}
													>
														{val}
													</Text>
												);
											})
										) : (
											<Text
												style={{
													paddingVertical: styles.spacing.xs,
													paddingHorizontal: styles.spacing.double_xl,
													backgroundColor: styles.theme.colors.primary,
													borderRadius: styles.border.radius.size.pill,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.sm,
													alignSelf: 'baseline',
													color: styles.font.colors._04
												}}
											>
												{answers}
											</Text>
										)}
									</View>
								</View>
							);
						})}
					</View>
				</Animated.View>
			)}

			{/* <View
				style={{
					display: 'flex',
					flexDirection: label === 'About You' ? 'row' : 'column',

					marginTop: 20,
					[section === 'about_you' ? 'columnGap' : 'rowGap']: 18,
					alignItems: 'flex-start'
				}}
			>
				{sectionValue.map(([questionTitle, selectedValue]) => (
					<View
						style={{ width: section !== 'about_you' ? '100%' : 'auto' }}
						key={questionTitle}
					>
						{section !== 'about_you' && (
							<Text
								style={{
									fontFamily: 'Outfit',
									fontSize: 12,
									fontWeight: '500',
									color: Colors.textColor + '9a',
									marginBottom: 4
								}}
							>
								{formatSnakeToTitle(questionTitle)}
							</Text>
						)}
						<View
							style={[
								STYLES.chipStyle,
								{
									backgroundColor: iconColor + '1A'
								}
							]}
						>
							{Array.isArray(selectedValue) ? (
								selectedValue.map((subItem) => (
									<Text style={STYLES.textStyle} key={subItem}>
										{formatSnakeToTitle(subItem)}
									</Text>
								))
							) : (
								<Text style={STYLES.textStyle}>{formatSnakeToTitle(selectedValue)}</Text>
							)}
						</View>
					</View>
				))}
			</View> */}
		</View>
	);
}

const STYLES = StyleSheet.create({
	iconStyle: {
		padding: 10,
		borderRadius: 100,

		marginRight: 12
	}
});

export default memo(EditCard);
