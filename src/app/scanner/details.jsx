import Header from '@/components/batch/Header';
import PressableBadge from '@/components/scanner/PressableBadge';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/Colors';
import PagePadding from '@/constants/PagePadding';
import { ArrowRight } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/components/Input';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import ingredients from '@/constants/Ingredients';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal
} from '@gorhom/bottom-sheet';
import WarnFill from '@/components/icons/WarnFill';
import PrimaryButton from '@/components/PrimaryButton';
import { useScanStore } from '@/stores/useScanStore';

const fuse = new Fuse(ingredients, {
	distance: 200
});
const fieldSchema = z.object({
	productName: z.string().min(4, { error: 'This field is required.' }),
	brand: z.string(),
	notes: z.string()
});

export default function ScannerDetails() {
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(fieldSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			productName: '',
			brand: '',
			notes: ''
		}
	});

	const [queryResult, setQueryResult] = useState(null);

	const { dismiss } = useBottomSheetModal();
	const { bottom } = useSafeAreaInsets();
	const bottomSheetRef = useRef(null);
	const scrollViewRef = useRef(null);
	const productNameRef = useRef(null);
	const brandRef = useRef(null);
	const notesRef = useRef(null);

	const ingredients = useScanStore((state) => state.ingredients);
	const setIngredients = useScanStore((state) => state.setIngredients);

	const queryResultOpacity = useSharedValue(0);
	const queryResultTransform = useSharedValue(0);

	const showQueryResults = () => {
		queryResultOpacity.value = 0;
		queryResultTransform.value = -5;

		queryResultOpacity.value = withTiming(1, { duration: 300 });
		queryResultTransform.value = withTiming(0, { duration: 400 });
	};

	const closeQueryResults = () => {
		queryResultOpacity.value = withTiming(0, { duration: 300 });
		queryResultTransform.value = withTiming(-5, { duration: 400 });
	};

	const handleRemoveIngredients = (removedId) => () => {
		setIngredients(ingredients.filter((item) => item.id !== removedId));
	};

	const handleQuery = (value) => () => {
		if (value.length <= 0) {
			closeQueryResults();
			return;
		}

		const result = fuse.search(value).slice(0, 3);

		setQueryResult(result);
		showQueryResults();
	};

	const onSubmit = (data) => {
		if (ingredients.length <= 0) {
			bottomSheetRef.current.present();
			return;
		}

		router.push({
			pathname: 'scanner/analysis_processing',
			params: {
				name: data.productName,
				brand: data.brand,
				notes: data.notes,
				ingredients: ingredients.map((item) => item.name).join(', ')
			}
		});
	};

	const animatedQueryResult = useAnimatedStyle(() => {
		return {
			opacity: queryResultOpacity.value,
			transform: [{ translateY: queryResultTransform.value }],
			zIndex: queryResultOpacity.value === 0 ? 1 : 2
		};
	});

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} opacity={0.7} disappearsOnIndex={-1} />,
		[]
	);

	return (
		<>
			<Header title={'Ingredient Details'} />
			<Animated.ScrollView
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				onScroll={({ nativeEvent }) => {
					if (nativeEvent.contentOffset.y <= 0) {
						scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
					}
				}}
				contentContainerStyle={{
					paddingHorizontal: PagePadding.config.paddingHorizontal,
					paddingBottom: bottom + 20,
					transitionDuration: 200
				}}
			>
				<View
					style={{
						backgroundColor: '#E8F5E9',
						padding: 20,
						borderRadius: 16,
						marginVertical: 20
					}}
				>
					<Text style={{ fontSize: 12, color: Colors.textColor, lineHeight: 18 }}>
						<Text style={{ fontWeight: 600, color: Colors.textColor }}>Tip: </Text>
						Search and add ingredients exactly as they appear on the product label. Press
						'Enter' or select from the list to add each ingredient as a tag.
					</Text>
				</View>

				<View style={{ marginBottom: 25 }}>
					<SearchBar
						closeQueryResults={closeQueryResults}
						handleQuery={handleQuery}
						placeholder='Type an ingredient...'
						style={[STYLES.inputStyle, STYLES.shadow]}
					/>

					<Animated.View
						style={[
							{
								borderRadius: 30,
								padding: 16,
								top: 40,
								backgroundColor: Colors.backgroundColor,
								borderTopWidth: 0,
								borderTopLeftRadius: 0,
								borderTopRightRadius: 0,

								position: 'absolute',
								width: '100%',
								rowGap: 20
							},
							animatedQueryResult
						]}
					>
						{queryResult?.length <= 0 && (
							<Text style={{ textAlign: 'center', fontSize: 10 }}>
								No results found. Please try a different search term.
							</Text>
						)}

						{queryResult?.map(({ item, refIndex }) => (
							<TouchableOpacity
								onPress={() => {
									if (!ingredients.some((prevItem) => prevItem.id === refIndex)) {
										setIngredients([...ingredients, { name: item, id: refIndex }]);
									}

									closeQueryResults();
								}}
								key={item}
								style={{ flexDirection: 'row', alignItems: 'center' }}
							>
								<Text style={{ color: Colors.textColor, fontWeight: 800, width: 180 }}>
									{item}
								</Text>
								<Text style={{ fontStyle: 'italic', marginLeft: 'auto', fontSize: 10 }}>
									Tap to add ingredient
								</Text>
							</TouchableOpacity>
						))}
					</Animated.View>
				</View>

				<View style={{ rowGap: 6 }}>
					<Text style={{ fontSize: 18, fontWeight: 700 }}>Ingredients</Text>
					<View
						style={{
							alignItems: 'flex-start',
							flexDirection: 'row',
							rowGap: 12,
							gap: 10,
							flexWrap: 'wrap',
							zIndex: 1
						}}
					>
						{ingredients.length === 0 && (
							<Text style={{ color: Colors.textColor + '7a' }}>
								No ingredients listed. Search to add.
							</Text>
						)}
						{ingredients.length > 0 &&
							ingredients?.map((item) => (
								<Animated.View key={item.name} layout={LinearTransition}>
									<PressableBadge
										name={item.name}
										handlePress={handleRemoveIngredients(item.id)}
									/>
								</Animated.View>
							))}
					</View>
				</View>

				<View style={{ marginTop: 25 }}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 700
						}}
					>
						Product Information
					</Text>

					<View style={{ marginTop: 20, rowGap: 16 }}>
						<View style={STYLES.fieldContainer}>
							<View style={STYLES.field}>
								<Text
									style={{
										fontWeight: 500
									}}
									onPress={() => productNameRef.current.focus()}
								>
									Product Name
								</Text>
								<Text style={{ color: 'red' }}>*</Text>
							</View>

							<Controller
								control={control}
								render={({
									field: { onChange, onBlur, value },
									fieldState: { error }
								}) => (
									<Input
										ref={productNameRef}
										onChangeText={onChange}
										value={value}
										placeholder='e.g., Hydrating Sunscreen'
										error={error}
									/>
								)}
								name='productName'
							/>
						</View>

						<View style={STYLES.fieldContainer}>
							<View style={STYLES.field}>
								<Text
									style={{
										fontWeight: 500
									}}
									onPress={() => brandRef.current.focus()}
								>
									Brand
								</Text>
								<Text style={{ color: Colors.textColor + '7a' }}>(Optional)</Text>
							</View>

							<Controller
								control={control}
								render={({ field: { onChange, value } }) => (
									<Input
										onChangeText={onChange}
										value={value}
										ref={brandRef}
										placeholder='e.g., BeauWise Naturals'
									/>
								)}
								name='brand'
							/>
						</View>

						<View style={STYLES.fieldContainer}>
							<View style={STYLES.field}>
								<Text
									style={{
										fontWeight: 500
									}}
									onPress={() => notesRef.current.focus()}
								>
									Notes
								</Text>
								<Text style={{ color: Colors.textColor + '7a' }}>(Optional)</Text>
							</View>

							<Controller
								control={control}
								render={({ field: { onChange, value } }) => (
									<TextInput
										onChangeText={onChange}
										value={value}
										ref={notesRef}
										multiline={true}
										numberOfLines={5}
										style={[
											STYLES.inputStyle,
											STYLES.shadow,
											{ height: 100, textAlignVertical: 'top' }
										]}
										placeholder='Any specific concerns or details...'
									/>
								)}
								name='notes'
							/>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleSubmit(onSubmit)}
						activeOpacity={0.7}
						style={STYLES.button}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 600,
								color: Colors.backgroundColor
							}}
						>
							Analyze Ingredients
						</Text>
						<ArrowRight color={'#fff'} size={16} />
					</TouchableOpacity>
				</View>
			</Animated.ScrollView>

			<BottomSheetModal
				backdropComponent={renderBackdrop}
				enableOverDrag={false}
				handleIndicatorStyle={{ display: 'none' }}
				ref={bottomSheetRef}
			>
				<BottomSheetView>
					<View
						style={{
							paddingBottom: bottom,
							paddingHorizontal: PagePadding.config.paddingHorizontal
						}}
					>
						<View style={{ alignItems: 'center', marginBottom: 10 }}>
							<WarnFill size={60} color='#ff8183' />
						</View>

						<View style={{ paddingBottom: 18 }}>
							<Text
								style={{
									textAlign: 'center',
									fontSize: 18,
									fontWeight: 700,
									color: Colors.textColor
								}}
							>
								No ingredients are listed
							</Text>
							<Text style={{ textAlign: 'center', color: Colors.textColor + '9a' }}>
								Please add some ingredients to analyze
							</Text>
						</View>

						<TouchableOpacity
							onPress={() => dismiss()}
							style={{ alignItems: 'center', paddingVertical: 10 }}
						>
							<Text style={{ fontSize: 12, fontWeight: 900, color: '#000' }}>CLOSE</Text>
						</TouchableOpacity>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}

const STYLES = StyleSheet.create({
	button: {
		columnGap: 6,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary,
		padding: 16,
		borderRadius: 16,
		marginTop: 30,

		shadowColor: '#00000071',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5
	},
	fieldContainer: {
		rowGap: 6
	},

	field: {
		flexDirection: 'row',
		columnGap: 4
	},
	inputStyle: {
		flexDirection: 'row',
		alignItems: 'center',

		backgroundColor: Colors.backgroundColor,

		borderRadius: 16,
		columnGap: 2,
		paddingHorizontal: 20,
		paddingVertical: 8
	},

	shadow: {
		shadowColor: '#00000086',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2
	}
});
