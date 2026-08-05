import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import TermsOfService from '@/constants/TermsOfService';
import Checkbox from 'expo-checkbox';
import { Circle } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ToS({ handleClose, handleAgree, activeTheme }) {
	const [isRead, setIsRead] = useState(false);
	const { bottom } = useSafeAreaInsets();
	return (
		<View
			style={{
				overflow: 'hidden',

				backgroundColor: styles.theme.colors[activeTheme].card_background
			}}
		>
			<Text
				style={{
					fontFamily: styles.font.family,
					fontSize: styles.font.size.xl,
					color: styles.theme.colors[activeTheme].text,
					fontWeight: styles.font.weight.bold,
					borderBottomWidth: 0.5,
					borderBottomColor: styles.theme.colors[activeTheme].seperator,
					paddingHorizontal: styles.spacing.one_xl,
					paddingVertical: styles.spacing.three_xl
				}}
			>
				Terms of Service
			</Text>

			<View
				style={{
					paddingHorizontal: styles.spacing.double_xl,
					paddingTop: PagePadding.config.paddingTop,
					rowGap: styles.spacing.three_xl
				}}
			>
				{TermsOfService.map((item, index) => (
					<View key={item.title}>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.semi_bold,
								fontSize: styles.font.size.md,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{index + 1}. {item.title}
						</Text>

						<View style={{ rowGap: 20 }}>
							{item.content.map((content, index) => (
								<Text
									style={{
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text_secondary,
										lineHeight: 20
									}}
									key={index}
								>
									{content}
								</Text>
							))}
						</View>

						{item.list_items && (
							<View style={{ rowGap: 8, marginTop: 8 }}>
								{item.list_items.map((content, index) => (
									<View
										key={index}
										style={{
											fontFamily: styles.font.family,
											flexDirection: 'row',
											columnGap: 8,
											marginLeft: 8,
											paddingRight: 20
										}}
									>
										<Circle
											strokeWidth={0}
											fill={styles.theme.colors[activeTheme].icon}
											style={{ marginTop: 8 }}
											size={6}
										/>
										<Text
											style={{
												fontSize: styles.font.size.md,
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text_secondary,
												lineHeight: 20
											}}
										>
											{content}
										</Text>
									</View>
								))}
							</View>
						)}

						{item.additional_content && (
							<View style={{ rowGap: 20, marginTop: 20 }}>
								{item.additional_content.map((content, index) => (
									<Text
										style={{
											fontSize: styles.font.size.md,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text_secondary,
											lineHeight: 20
										}}
										key={index}
									>
										{content}
									</Text>
								))}
							</View>
						)}

						{item.subsections && (
							<View style={{ rowGap: 20, marginTop: 20 }}>
								{item.subsections.map(
									({ title, content, list_items, additional_content }, index) => (
										<View style={{ rowGap: 4 }} key={index}>
											<Text
												style={{
													fontWeight: styles.font.weight.semi_bold,
													fontSize: styles.font.size.md,
													fontFamily: styles.font.family,
													color: styles.theme.colors[activeTheme].text_secondary
												}}
											>
												{title}
											</Text>

											<Text
												style={{
													fontWeight: styles.font.weight.regular,
													fontSize: styles.font.size.md,
													fontFamily: styles.font.family,
													color: styles.theme.colors[activeTheme].text_secondary
												}}
												key={index}
											>
												{content}
											</Text>

											{list_items.map((item) => (
												<View
													key={index + item}
													style={{
														flexDirection: 'row',
														columnGap: 8,
														marginLeft: 8,
														paddingRight: 20
													}}
												>
													<Circle
														strokeWidth={0}
														fill={styles.theme.colors[activeTheme].icon + '4a'}
														style={{ marginTop: 8 }}
														size={6}
													/>
													<Text
														style={{
															fontSize: styles.font.size.md,
															fontFamily: styles.font.family,
															color: styles.theme.colors[activeTheme].text_secondary,
															lineHeight: 20
														}}
													>
														{item}
													</Text>
												</View>
											))}

											{additional_content && (
												<Text
													style={{
														marginTop: styles.spacing.lg,
														lineHeight: styles.spacing.double_xl,
														fontSize: styles.font.size.md,
														fontFamily: styles.font.family,
														color: styles.theme.colors[activeTheme].text_secondary
													}}
												>
													{additional_content}
												</Text>
											)}
										</View>
									)
								)}
							</View>
						)}
					</View>
				))}

				<View style={{ rowGap: 30, marginTop: 10 }}>
					<View style={{ alignItems: 'center' }}>
						<TouchableOpacity
							onPress={() => setIsRead(!isRead)}
							style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}
							activeOpacity={0.5}
						>
							<Checkbox
								color={isRead ? Colors.primary : undefined}
								value={isRead}
								style={{
									aspectRatio: 1,
									width: 15,
									pointerEvents: 'none',
									borderRadius: 4,
									backgroundColor: styles.theme.colors[activeTheme].card_background
								}}
							/>

							<View>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].text,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									I have read the full document
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					<View style={{ flexDirection: 'row', marginBottom: styles.spacing.xxl }}>
						<TouchableOpacity
							onPress={handleClose}
							activeOpacity={0.5}
							style={[STYLES.button, { backgroundColor: 'transparent' }]}
						>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.light,
									color: styles.theme.colors[activeTheme].text,
									fontSize: styles.font.size.md
								}}
							>
								Decline
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleAgree}
							activeOpacity={0.5}
							disabled={!isRead}
							style={[
								STYLES.button,
								{
									opacity: !isRead ? 0.5 : 1
								}
							]}
						>
							<Text
								style={{
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.light,
									color: '#fff'
								}}
							>
								I Agree
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

const STYLES = StyleSheet.create({
	button: {
		flex: 1,
		paddingVertical: 16,
		columnGap: 6,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.primary,
		borderRadius: styles.border.radius.size.sm
	}
});
