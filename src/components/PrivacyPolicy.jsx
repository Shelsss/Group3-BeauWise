import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import PrivacyPolicy from '@/constants/PrivacyPolicy';
import { Circle } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Policy({ handleAgree, activeTheme }) {
	return (
		<View
			style={{
				overflow: 'hidden',
				zIndex: -1,
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
				Privacy Policy
			</Text>

			<View
				style={{
					paddingHorizontal: styles.spacing.double_xl,
					paddingTop: PagePadding.config.paddingTop,
					rowGap: styles.spacing.three_xl
				}}
			>
				{PrivacyPolicy.map((item, index) => (
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
							<Text
								style={{
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text_secondary,
									lineHeight: 20
								}}
								key={index}
							>
								{item.content}
							</Text>
						</View>

						{item.list_items && (
							<View style={{ rowGap: 8, marginTop: 8 }}>
								{item.list_items.map((content, index) => (
									<View
										key={index}
										style={{
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
								<Text
									style={{
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text_secondary,
										lineHeight: 20
									}}
									key={index}
								>
									{item.additional_content}
								</Text>
							</View>
						)}
					</View>
				))}

				<TouchableOpacity onPress={handleAgree} activeOpacity={0.5} style={STYLES.button}>
					<Text
						style={{
							fontFamily: styles.font.family,
							color: styles.font.colors._04,
							fontSize: styles.font.size.md
						}}
					>
						I Agree
					</Text>
				</TouchableOpacity>

				<Text
					style={{
						fontSize: styles.font.size.md,
						fontFamily: styles.font.family,
						color: styles.theme.colors[activeTheme].text_secondary,
						lineHeight: 20,
						marginBottom: styles.spacing.xxl
					}}
				>
					By clicking "I Agree", you acknowledge that you have read and understood our
					terms.
				</Text>
			</View>
		</View>
	);
}

const STYLES = StyleSheet.create({
	button: {
		paddingVertical: styles.spacing.xxl,
		columnGap: 6,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: styles.theme.colors.primary,
		borderRadius: styles.border.radius.size.sm
	}
});
