import styles from '@/config/styles';
import { auth } from '@/services/auth';
import { db } from '@/services/firestore';
import { doc, getDoc, query } from '@react-native-firebase/firestore';
import { FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Camera from '../icons/hugeicons/Camera';
import TestTube from '../icons/hugeicons/TestTube';
import ShieldCheck from '../icons/hugeicons/ShieldCheck';
import Warn2 from '../icons/hugeicons/Warn2';
import { useQuery } from '@tanstack/react-query';
import Skeleton from '../Skeleton';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import Ccw from '../icons/hugeicons/Ccw';
import Warn from '../icons/hugeicons/Warn';
import Animated from 'react-native-reanimated';
import { staggerCardAnimation } from '@/utility/animations';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';

const fetchData = async () => {
	const queryOption = query(doc(db, 'users', auth.currentUser.uid));

	const documentSnapshot = await getDoc(queryOption);
	// const recentAnalysis = await getDocumentFilterToday('analysis_history').call();

	return {
		...documentSnapshot.data()
	};
};

const dashboardSchema = [
	{
		field: 'total_analysis',
		label: 'Total Analysis',
		color: styles.theme.colors.primary,
		count: 0,
		icon: (size, color) => <Camera color={color} size={size} />
	},
	{
		field: 'alignedIngredients',
		label: 'Aligned Ingredients',
		color: styles.theme.colors.primary,
		isRightPosition: true,
		count: 0,
		icon: (size, color) => <TestTube color={color} size={size} />
	},
	{
		field: 'total_fda_notified',
		label: 'FDA-Notified Products Verified',
		color: styles.theme.colors.fda,
		count: 0,
		icon: (size, color) => <ShieldCheck color={color} size={size} />
	},

	{
		field: 'restrictedIngredients',
		label: 'Restricted Ingredients',
		count: 0,
		color: styles.theme.colors.status.red,
		isRightPosition: true,
		icon: (size, color) => <Warn2 color={color} size={size} />
	}
];

export default function Metrics() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [selectedMetric, setSelectedMetric] = useState(null);

	const { dismiss } = useBottomSheetModal();

	const { data, refetch, isError, isRefetchError, isFetching } = useQuery({
		queryKey: ['metrics'],
		queryFn: fetchData,
		enabled: isAuthenticated
	});

	const formatData = () => {
		return dashboardSchema.map((item) => ({
			...item,
			count:
				item.field === 'alignedIngredients' || item.field === 'restrictedIngredients'
					? (data[item.field]?.length ?? 0)
					: (data[item.field] ?? 0)
		}));
	};

	const sheetRef = useRef(null);

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={1.8} disappearsOnIndex={-1} />,
		[]
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	const handleOpenModal = (field) => () => {
		sheetRef.current?.present();
		setSelectedMetric(field);
	};

	useBackHandler(() => {
		return dismiss();
	}, []);

	return (
		<>
			{isError || isRefetchError ? (
				<View
					style={{
						width: '100%',
						height: 138,
						borderWidth: 1,
						alignItems: 'center',
						justifyContent: 'center',
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderRadius: styles.border.radius.size.md,
						rowGap: styles.spacing.md
					}}
				>
					<Warn
						color={styles.theme.colors[activeTheme].icon}
						size={styles.icon.size.xl}
					/>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						We couldn't load your overview
					</Text>
					<TouchableOpacity
						onPress={() => {
							refetch({
								throwOnError: true
							});
						}}
						style={{
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].card_border,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							paddingHorizontal: styles.spacing.xxl,
							paddingVertical: styles.spacing.md,
							borderRadius: styles.border.radius.size.sm,
							alignItems: 'center',
							flexDirection: 'row',
							columnGap: styles.spacing.sm
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								fontSize: styles.font.size.md,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Retry
						</Text>
						<Ccw
							size={styles.icon.size.lg}
							color={styles.theme.colors[activeTheme].icon}
						/>
					</TouchableOpacity>
				</View>
			) : isFetching ? (
				<View>
					<Skeleton
						height={138}
						width={'100%'}
						borderRadius={styles.border.radius.size.md}
					/>
				</View>
			) : (
				<FlatList
					contentContainerStyle={{
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						padding: styles.spacing.three_xl,
						borderRadius: styles.border.radius.size.md,
						rowGap: styles.spacing.three_xl
					}}
					columnWrapperStyle={{
						gap: styles.spacing.three_xl
					}}
					numColumns={2}
					data={formatData()}
					renderItem={({
						item: { icon, label, field, color, isRightPosition, count },
						index
					}) => {
						return field === 'restrictedIngredients' || field === 'alignedIngredients' ? (
							<Animated.View entering={staggerCardAnimation(index)} style={{ flex: 1 }}>
								<TouchableOpacity
									onPress={handleOpenModal(field)}
									style={{ alignItems: 'center', rowGap: styles.spacing.xs }}
								>
									<View style={[{ position: 'absolute', left: 2, top: 4 }]}>
										{icon(styles.icon.size.lg, color)}
									</View>
									<Text
										style={{
											fontSize: styles.font.size.xxl,
											fontWeight: styles.font.weight.semi_bold,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										{count ?? 0}
									</Text>
									<Text
										style={{
											fontFamily: styles.font.family,
											fontSize: styles.font.size.xs,
											color: styles.theme.colors[activeTheme].text_secondary
										}}
									>
										{label}
									</Text>
								</TouchableOpacity>
							</Animated.View>
						) : (
							<Animated.View
								entering={staggerCardAnimation(index)}
								style={{ alignItems: 'center', flex: 1, rowGap: styles.spacing.xs }}
							>
								<View style={[{ position: 'absolute', left: 2, top: 4 }]}>
									{icon(styles.icon.size.lg, color)}
								</View>
								<Text
									style={{
										fontSize: styles.font.size.xxl,
										fontWeight: styles.font.weight.semi_bold,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{count ?? 0}
								</Text>
								<Text
									style={{
										fontFamily: styles.font.family,
										fontSize: styles.font.size.xs,
										color: styles.theme.colors[activeTheme].text_secondary
									}}
								>
									{label}
								</Text>
							</Animated.View>
						);
					}}
				/>
			)}

			<BottomSheetModal
				animationConfigs={animationConfigs}
				handleComponent={null}
				snapPoints={['70%']}
				backgroundStyle={{
					backgroundColor: styles.theme.colors[activeTheme].screen_background,
					borderRadius: styles.border.radius.size.sm
				}}
				ref={sheetRef}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetScrollView showsVerticalScrollIndicator={false}>
					<View
						style={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: styles.spacing.three_xxl,
							marginHorizontal: styles.spacing.double_xl,
							marginBottom: styles.spacing.three_xxl * 1.4,
							rowGap: styles.spacing.double_xl
						}}
					>
						{selectedMetric === 'alignedIngredients' && (
							<View style={{ alignItems: 'center', rowGap: styles.spacing.md }}>
								<TestTube
									size={styles.icon.size.xl * 2}
									color={styles.theme.colors.primary}
								/>

								<Text
									style={{
										fontSize: styles.font.size.lg,
										fontWeight: styles.font.weight.semi_bold,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Aligned Ingredients
								</Text>
							</View>
						)}

						{selectedMetric === 'restrictedIngredients' && (
							<View style={{ alignItems: 'center', rowGap: styles.spacing.md }}>
								<Warn2
									size={styles.icon.size.xl * 2}
									color={styles.theme.colors.status.red}
								/>

								<Text
									style={{
										fontSize: styles.font.size.lg,
										fontWeight: styles.font.weight.semi_bold,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Restricted Ingredients
								</Text>
							</View>
						)}
						<View style={{ rowGap: styles.spacing.double_xl }}>
							{selectedMetric === 'alignedIngredients' &&
								(data['alignedIngredients']?.length ?? 0) <= 0 && (
									<View>
										<Text
											style={{
												textAlign: 'center',
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text_secondary
											}}
										>
											No aligned ingredients yet. Scan your first item to get started!
										</Text>
									</View>
								)}

							{selectedMetric === 'restrictedIngredients' &&
								(data['restrictedIngredients']?.length ?? 0) <= 0 && (
									<View>
										<Text
											style={{
												textAlign: 'center',
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text_secondary
											}}
										>
											All clear! You don't have any restricted ingredients right now.
										</Text>
									</View>
								)}

							{data &&
								data[selectedMetric]?.map((item) => (
									<View
										key={item.ingredient}
										style={{
											padding: styles.spacing.double_xl,
											borderColor: styles.theme.colors[activeTheme].card_border,
											backgroundColor: styles.theme.colors[activeTheme].card_background,
											borderRadius: styles.border.radius.size.sm,
											borderWidth: 1
										}}
									>
										<Text
											style={{
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text
											}}
										>
											{item.ingredient}
										</Text>
										<Text
											style={{
												fontFamily: styles.font.family,
												color: styles.theme.colors[activeTheme].text_secondary
											}}
										>
											{item.description}
										</Text>
									</View>
								))}
						</View>
					</View>
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}
