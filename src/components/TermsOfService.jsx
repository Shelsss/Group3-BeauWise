import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import TermsOfService from '@/constants/TermsOfService';
import Checkbox from 'expo-checkbox';
import { Circle } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ToS({ handleClose, handleAgree }) {
	const [isRead, setIsRead] = useState(false);
	const { bottom } = useSafeAreaInsets();
	return (
		<View style={{ overflow: 'hidden', zIndex: -1, paddingBottom: bottom + 10 }}>
			<Text
				style={{
					fontSize: 22,
					color: Colors.textColor,
					fontWeight: 700,
					borderBottomWidth: 0.5,
					borderBottomColor: Colors.textColor + '1a',
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingVertical: PagePadding.config.paddingTop
				}}
			>
				Terms of Service
			</Text>

			<View
				style={{
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingTop: PagePadding.config.paddingTop,
					rowGap: 20
				}}
			>
				{TermsOfService.map((item, index) => (
					<View key={item.title}>
						<Text style={{ fontWeight: 700, fontSize: 16, color: Colors.textColor }}>
							{index + 1}. {item.title}
						</Text>

						<View style={{ rowGap: 20 }}>
							{item.content.map((content, index) => (
								<Text
									style={{ color: Colors.textColor + '9a', lineHeight: 20 }}
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
										<Text style={{ color: Colors.textColor + '9a', lineHeight: 20 }}>
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
										style={{ color: Colors.textColor + '9a', lineHeight: 20 }}
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
											<Text style={{ color: Colors.textColor, fontWeight: 700 }}>
												{title}
											</Text>

											<Text style={{ color: Colors.textColor }} key={index}>
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
														fill={Colors.textColor}
														style={{ marginTop: 7 }}
														size={6}
													/>
													<Text
														style={{ color: Colors.textColor + '9a', lineHeight: 20 }}
													>
														{item}
													</Text>
												</View>
											))}

											{additional_content && (
												<Text style={{ color: Colors.textColor + '9a' }}>
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
									backgroundColor: '#f9f8f8c4'
								}}
							/>

							<View>
								<Text style={{ fontSize: 12 }}>I have read the full document</Text>
							</View>
						</TouchableOpacity>
					</View>

					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							onPress={handleClose}
							activeOpacity={0.5}
							style={[STYLES.button, { backgroundColor: 'transparent' }]}
						>
							<Text style={{ fontSize: 16, fontWeight: 600, color: Colors.textColor }}>
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
							<Text style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
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
		borderRadius: 16
	}
});
