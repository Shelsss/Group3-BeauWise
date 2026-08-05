import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { onScroll } from '@/utility/scrollView';
import { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

export default function Disclaimer({
	schema,
	setDisclaimerButtonActive,
	disabled,
	onPress,
	disclaimerVisible,
	backgroundColor
}) {
	const scrollRef = useRef(null);
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<Portal>
			<Modal
				visible={disclaimerVisible}
				style={{
					marginHorizontal: styles.spacing.one_xl
				}}
			>
				<View
					style={{
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderRadius: styles.border.radius.size.sm
					}}
				>
					<View
						style={{
							borderBottomWidth: 1,
							borderBottomColor: styles.theme.colors[activeTheme].card_border,
							flexDirection: 'row',
							alignItems: 'center',
							padding: styles.spacing.one_xxl
						}}
					>
						<Text
							style={{
								fontSize: styles.font.size.lg,
								fontWeight: styles.font.weight.semi_bold,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Disclaimer
						</Text>
					</View>

					<ScrollView
						onMomentumScrollEnd={({ nativeEvent }) => {
							const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

							if (isCloseToBottom(layoutMeasurement, contentOffset, contentSize)) {
								setDisclaimerButtonActive(false);
							}
						}}
						ref={scrollRef}
						onScroll={onScroll(scrollRef)}
						showsVerticalScrollIndicator={false}
						style={{ height: 500 }}
						contentContainerStyle={{
							padding: styles.spacing.one_xxl,
							rowGap: styles.spacing.one_xxl
						}}
					>
						{schema.map((item) => (
							<View key={item.name}>
								<Text
									style={{
										fontWeight: styles.font.weight.bold,
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{item.name}
								</Text>

								<View style={{ rowGap: styles.spacing.lg }}>
									{item.contents.map((content) => (
										<Text
											key={content}
											style={{
												fontSize: styles.font.size.md,
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text_secondary
											}}
										>
											{content}
										</Text>
									))}
								</View>
							</View>
						))}
					</ScrollView>

					<View
						style={{
							borderTopWidth: 1,
							borderTopColor: styles.theme.colors[activeTheme].card_border
						}}
					>
						<TouchableOpacity
							disabled={disabled}
							onPress={onPress}
							activeOpacity={0.7}
							style={{
								opacity: disabled ? 0.5 : 1,
								margin: styles.spacing.double_xxl,
								backgroundColor: backgroundColor,
								alignItems: 'center',
								borderRadius: styles.border.radius.size.sm,
								paddingVertical: styles.spacing.one_xl
							}}
						>
							<Text
								style={{
									fontWeight: styles.font.weight.bold,
									fontFamily: styles.font.family,
									fontSize: styles.font.size.md,
									color: styles.font.colors._04
								}}
							>
								I understand
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Portal>
	);
}

function isCloseToBottom(layoutMeasurement, contentOffset, contentSize) {
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
}
