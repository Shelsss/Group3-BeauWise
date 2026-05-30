import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import PrivacyPolicy from '@/constants/PrivacyPolicy';
import { Circle } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Policy({ handleAgree }) {
	const { bottom } = useSafeAreaInsets();
	return (
		<View style={{ overflow: 'hidden', zIndex: -1, paddingBottom: bottom + 10 }}>
			<Text
				style={{
					fontFamily: 'Outfit',
					fontSize: 18,
					color: Colors.textColor,
					fontWeight: 700,
					borderBottomWidth: 0.5,
					borderBottomColor: Colors.textColor + '1a',
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingVertical: PagePadding.config.paddingTop
				}}
			>
				Privacy Policy
			</Text>

			<View
				style={{
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingTop: PagePadding.config.paddingTop,
					rowGap: 20
				}}
			>
				{PrivacyPolicy.map((item, index) => (
					<View key={item.title}>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontWeight: 700,
								fontSize: 16,
								color: Colors.textColor
							}}
						>
							{index + 1}. {item.title}
						</Text>

						<View style={{ rowGap: 20 }}>
							<Text
								style={{
									fontFamily: 'Outfit',
									color: Colors.textColor + '9a',
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
											fill={Colors.textColor}
											style={{ marginTop: 7 }}
											size={6}
										/>
										<Text
											style={{
												fontFamily: 'Outfit',
												color: Colors.textColor + '9a',
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
										fontFamily: 'Outfit',
										color: Colors.textColor + '9a',
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
					<Text style={{ fontFamily: 'Outfit', color: '#fff' }}>I Agree</Text>
				</TouchableOpacity>

				<Text
					style={{
						fontFamily: 'Outfit',
						color: Colors.textColor + '7a',
						textAlign: 'center'
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
		flex: 1,
		paddingVertical: 16,
		columnGap: 6,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.primary,
		borderRadius: 10
	}
});
