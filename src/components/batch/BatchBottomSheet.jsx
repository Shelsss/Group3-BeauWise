import React, { useCallback, useEffect } from 'react';
import { Text, StyleSheet, BackHandler, View, TouchableOpacity } from 'react-native';

import {
	BottomSheetModal,
	BottomSheetBackdrop,
	useBottomSheetModal,
	BottomSheetScrollView,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';

import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '@/config/styles';
import Label from '../icons/hugeicons/Label';
import Animated, { createAnimatedComponent, FadeIn } from 'react-native-reanimated';
import { Controller } from 'react-hook-form';

// TODO: Add other brands from cosmeticcheck.app
const brands = [
	{
		text: 'Sunsilk',
		keyParameters: 'sunsilk'
	},
	{
		text: 'Head and Shoulders',
		keyParameters: 'head-shoulders'
	},
	{
		text: 'CeraVe',
		keyParameters: 'cerave'
	},
	{
		text: 'Dove',
		keyParameters: 'dove'
	},
	{
		text: 'Johnson & Johnson',
		keyParameters: 'johnson-johnson'
	},
	{
		text: "Johnson's Baby",
		keyParameters: 'johnsons-baby'
	},
	{
		text: "L'Oreal Paris",
		keyParameters: 'loreal-paris'
	},
	{
		text: 'Maybelline New York',
		keyParameters: 'maybelline-new-york'
	},
	{
		text: 'NIVEA',
		keyParameters: 'nivea'
	},
	{
		text: 'Olay',
		keyParameters: 'olay'
	},
	{
		text: 'Pantene',
		keyParameters: 'pantene'
	},
	{
		text: "Paula's Choice",
		keyParameters: 'paulas-choice'
	},
	{
		text: 'Sephora',
		keyParameters: 'sephora'
	},
	{
		text: 'The Ordinary',
		keyParameters: 'the-ordinary'
	},
	{
		text: 'Tresemme',
		keyParameters: 'tresemme'
	},
	{
		text: 'Vaseline',
		keyParameters: 'vaseline'
	}
];

const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);

const BatchBottomSheet = ({ batchSheetModalRef, activeTheme, control }) => {
	const { bottom } = useSafeAreaInsets();
	const { dismiss } = useBottomSheetModal();
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.7}
				disappearsOnIndex={-1}
				pressBehavior={'collapse'}
			/>
		),
		[]
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	useEffect(() => {
		const backAction = () => {
			return dismiss();
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	return (
		<>
			<Controller
				control={control}
				name='brand'
				render={({ field: { onChange, value }, fieldState: { error } }) => (
					<BottomSheetModal
						animationConfigs={animationConfigs}
						snapPoints={['60%']}
						enableDynamicSizing={false}
						handleComponent={null}
						ref={batchSheetModalRef}
						backdropComponent={renderBackdrop}
						backgroundStyle={{
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<>
							<BottomSheetScrollView
								showsVerticalScrollIndicator={false}
								style={[
									STYLES.contentContainer,
									{
										paddingBottom: bottom
									}
								]}
							>
								<View
									style={{
										paddingTop: 20,
										paddingBottom: styles.spacing.double_xl,
										alignSelf: 'center',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											columnGap: styles.spacing.lg
										}}
									>
										<Label size={styles.icon.size.xl} color={styles.theme.colors.batch} />

										<Text
											style={{
												fontFamily: styles.font.family,
												fontSize: styles.font.size.xl,
												fontWeight: styles.font.weight.bold,
												color: styles.theme.colors.batch
											}}
										>
											Brands
										</Text>
									</View>
								</View>

								<View
									style={{
										display: 'flex',
										rowGap: 16,
										marginBottom: 30
									}}
								>
									{brands.map((item, index) => (
										<AnimatedTouchableOpacity
											key={`${item.keyParameters}`}
											onPress={() => {
												onChange(item);
											}}
											style={{
												borderRadius: styles.border.radius.size.sm,
												paddingVertical: 18,
												overflow: 'hidden',
												backgroundColor:
													value?.keyParameters === item.keyParameters
														? styles.theme.colors.batch
														: 'transparent',
												transitionDuration: 180
											}}
										>
											<Text
												style={{
													fontFamily: styles.font.family,
													fontSize: 14,
													color:
														value?.keyParameters === item.keyParameters
															? styles.font.colors._04
															: styles.theme.colors[activeTheme].text,
													fontWeight: styles.font.weight.regular,
													textAlign: 'center'
												}}
											>
												{item.text}
											</Text>
										</AnimatedTouchableOpacity>
									))}
								</View>
							</BottomSheetScrollView>

							{value && (
								<Animated.View
									entering={FadeIn}
									style={{
										position: 'absolute',

										bottom: 140,
										right: 20
									}}
								>
									<TouchableOpacity
										onPress={() => {
											batchSheetModalRef.current?.dismiss();
										}}
										activeOpacity={0.7}
									>
										<View
											style={{
												borderColor: styles.theme.colors[activeTheme].card_border,
												borderWidth: 0.5,
												borderRadius: styles.border.radius.size.pill,
												padding: styles.spacing.xxl,
												columnGap: styles.spacing.md,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
												backgroundColor: styles.theme.colors.batch
											}}
										>
											<Check
												size={styles.icon.size.xl * 1.4}
												color={styles.icon.colors._05}
												strokeWidth={1.5}
											/>
										</View>
									</TouchableOpacity>
								</Animated.View>
							)}
						</>
					</BottomSheetModal>
				)}
			/>
		</>
	);
};

const STYLES = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default BatchBottomSheet;
