import styles from '@/config/styles';
import { useScanStore } from '@/stores/useScanStore';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { useBackHandler } from '@react-native-community/hooks';
import { Check } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';

export default function SearchBottomSheet({
	ref,
	activeTheme,
	items,
	setSelectedIngredient
}) {
	const ingredients = useScanStore((state) => state.ingredients);

	const setIngredients = useScanStore((state) => state.setIngredients);

	const [selectedItem, setSelectedItem] = useState(null);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});
	const { dismiss } = useBottomSheetModal();

	const onItemSelect = (item) => () => {
		setSelectedItem(item);
	};

	const onItemConfirm = () => {
		if (selectedItem) {
			setSelectedItem(null);
			setIngredients([selectedItem, ...ingredients]);
		}
		dismiss();
	};

	const formattedItems = items?.filter((item) => {
		const previousItem = ingredients?.find(({ id }) => id === item?.id);
		return previousItem === undefined;
	});

	const renderBackdrop = useCallback(
		(props) => (
			<>
				<BottomSheetBackdrop
					{...props}
					opacity={1.8}
					disappearsOnIndex={-1}
					pressBehavior='none'
				/>
			</>
		),
		[]
	);

	useBackHandler(() => {
		return dismiss();
	}, []);
	return (
		<>
			<BottomSheetModal
				ref={ref}
				backdropComponent={renderBackdrop}
				animationConfigs={animationConfigs}
				handleComponent={() => {
					return (
						<Animated.View
							style={{
								alignSelf: 'flex-end',
								marginRight: styles.spacing.double_xl,
								marginBottom: styles.spacing.double_xl,
								opacity: selectedItem ? 1 : 0,
								transitionDuration: 400
							}}
						>
							<TouchableOpacity
								onPress={onItemConfirm}
								style={{
									backgroundColor: styles.theme.colors.primary,
									padding: styles.spacing.xxl,
									borderRadius: styles.border.radius.size.pill
								}}
							>
								<Check
									color={styles.icon.colors._05}
									strokeWidth={1.5}
									size={styles.icon.size.xl * 1.2}
								/>
							</TouchableOpacity>
						</Animated.View>
					);
				}}
				enablePanDownToClose={false}
				enableOverDrag={false}
				backgroundStyle={{
					borderRadius: styles.border.radius.size.sm,
					backgroundColor: styles.theme.colors[activeTheme].screen_background,
					overflow: 'visible'
				}}
				backgroundComponent={null}
				containerStyle={{
					overflow: 'scroll'
				}}
				style={{
					overflow: 'visible'
				}}
			>
				<BottomSheetView>
					<View
						style={{
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.double_xl,
							backgroundColor: styles.theme.colors[activeTheme].screen_background
						}}
					>
						<Text
							style={{
								marginBottom: styles.spacing.double_xl,
								textAlign: 'center',
								fontSize: styles.font.size.lg,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text,
								fontWeight: styles.font.weight.bold
							}}
						>
							Search Results
						</Text>
						<View
							style={{
								rowGap: styles.spacing.one_xl,
								paddingBottom: styles.spacing.three_xxl,
								alignItems: 'center'
							}}
						>
							{items?.length <= 0 ? (
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text_secondary,
										transitionDuration: 180
									}}
								>
									No items found matching your search.
								</Text>
							) : formattedItems?.length <= 0 ? (
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.md,
										color: styles.theme.colors[activeTheme].text_secondary,
										transitionDuration: 180
									}}
								>
									No new items found. Your search term is already in the list.
								</Text>
							) : (
								formattedItems?.map((item) => {
									return (
										<TouchableOpacity
											activeOpacity={0.7}
											onPress={onItemSelect(item)}
											key={item?.id}
											style={{
												alignSelf: 'stretch',
												borderRadius: styles.border.radius.size.sm,
												padding: styles.spacing.xxl,
												flexDirection: 'row',
												paddingVertical: styles.spacing.double_xl,
												alignItems: 'center',
												backgroundColor:
													item?.id === selectedItem?.id
														? styles.theme.colors.primary
														: 'transparent',
												justifyContent: 'center'
											}}
										>
											<Animated.Text
												style={{
													fontFamily: styles.font.family,
													fontSize: styles.font.size.md,
													color:
														item?.id === selectedItem?.id
															? styles.font.colors._04
															: styles.theme.colors[activeTheme].text,
													transitionDuration: 180
												}}
											>
												{item?.name}
											</Animated.Text>
										</TouchableOpacity>
									);
								})
							)}
						</View>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}
