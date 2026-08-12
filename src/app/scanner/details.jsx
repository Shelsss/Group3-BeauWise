import PagePadding from '@/constants/PagePadding';
import { ChevronLeft, Eye, EyeClosed, Info, Search, X } from 'lucide-react-native';

import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
	TextInput
} from 'react-native';
import Animated, {
	createAnimatedComponent,
	Extrapolation,
	FadeIn,
	FadeOut,
	interpolate,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated';

import { z } from 'zod';

import { router } from 'expo-router';

import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import Warn from '@/components/icons/hugeicons/Warn';
import { useScanStore } from '@/stores/useScanStore';
import ArrowRight from '@/components/icons/hugeicons/ArrowRight';
import {
	entryScaleHeight,
	entrySpringDown,
	exitScaleAnimation,
	exitSpringUp
} from '@/utility/animations';
import Edit from '@/components/icons/hugeicons/Edit';
import Edit2 from '@/components/icons/hugeicons/Edit2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeIngredients, searchEngine } from '@/services/cloudFunctions';
import SearchResultBottomSheet from '@/components/scanner/SearchBottomSheet';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import InfiniteFade from '@/components/InfiniteFade';
import AiBeautify from '@/components/icons/hugeicons/AiBeautify';
import Results from '@/components/scanner/Result';
import { useBackHandler } from '@react-native-community/hooks';
import Toast from 'react-native-toast-message';

const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity);

const formSchema = z.object({
	name: z.string().min(4, { error: 'This field is required.' }),
	brand: z.string().optional(),
	notes: z.string().optional()
});

export default function ScannerDetails() {
	const queryClient = useQueryClient();
	const { control, handleSubmit, watch, getValues } = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			name: ''
		}
	});

	const productName = watch('name');

	const analyze = useMutation({
		mutationFn: analyzeIngredients,
		onError: (err) => {
			Toast.show({
				type: 'errorToast',
				text1: 'Analysis Failed. Please try again',
				visibilityTime: 8000
			});
		},
		onSuccess: (data) => {
			if (!data) {
				throw new Error('Something went wrong.');
			}

			resetIngredients();
			queryClient.invalidateQueries({ queryKey: ['analysis_history'] });
			queryClient.invalidateQueries({ queryKey: ['metrics'] });
			queryClient.invalidateQueries({ queryKey: ['recent-analysis'] });
		}
	});

	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const searchQuery = useMutation({
		mutationFn: searchEngine,
		onSuccess: () => {
			searchRef.current?.present();
		},

		onError: (e) => {
			Toast.show({
				type: 'errorToast',
				text1: 'Something went wrong. Please try again',
				visibilityTime: 8000
			});
		}
	});

	const [modalVisible, setModalVisible] = useState(false);
	const [inputIngredientVisible, setInputIngredientVisible] = useState(true);
	const [ingredientsVisible, setIngredientsVisible] = useState(false);

	const ingredients = useScanStore((state) => state.ingredients);
	const setIngredients = useScanStore((state) => state.setIngredients);
	const resetIngredients = useScanStore((state) => state.resetIngredients);

	const searchRef = useRef(null);
	const brandInputRef = useRef(null);
	const notesInputRef = useRef(null);

	const onNextProductInput = () => {
		setInputIngredientVisible((prev) => {
			let status;
			if (prev) {
				status = false;
			} else {
				status = true;
			}

			return status;
		});
	};

	const onShowOnlyIngredients = () => {
		setIngredientsVisible((prev) => !prev);
	};
	const onRemoveIngredient = (id) => () => {
		const newItems = ingredients.filter((item) => item?.id !== id);

		setIngredients(newItems);
	};
	const onSearchIngredient = (query) => {
		if (query?.length <= 0) {
			return;
		}

		searchQuery.mutate({ query, collectionKey: 'ingredients' });
	};
	const onAnalyzeIngredients = (data) => {
		const parsedIngredients = ingredients.map((item) => item.name);

		analyze.mutate({
			ingredients: parsedIngredients,
			product: { ...data },
			clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		});
	};

	const formatSearchResults = () => {
		return searchQuery.data?.searchedData.map((item) => item);
	};

	const animationDriver = useSharedValue(0);

	useEffect(() => {
		animationDriver.value = withSpring(inputIngredientVisible ? 1 : 0, {
			damping: 200
		});
	}, [inputIngredientVisible]);

	useBackHandler(() => {
		if (analyze.isPending) {
			setModalVisible(true);
			return true;
		}
	}, [analyze.isPending, modalVisible, analyze.data]);

	const isVisible = inputIngredientVisible && ingredients.length > 0;
	return analyze.data && !analyze.isError ? (
		<>
			<Animated.View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: styles.spacing.double_xl,
					paddingTop: 62,
					paddingBottom: styles.spacing.double_xxl,
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					onPress={router.back}
					style={{
						paddingRight: styles.spacing.xxl
					}}
				>
					<ChevronLeft color={styles.icon.colors._05} size={styles.icon.size.xl} />
				</TouchableOpacity>
				<View>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.xl,
							fontWeight: styles.font.weight.bold,
							color: styles.font.colors._04
						}}
					>
						Analysis Results
					</Text>
				</View>
			</Animated.View>
			<Results
				analyzedIngredients={analyze?.data?.results}
				product={{ ...getValues() }}
			/>
		</>
	) : analyze.isPending ? (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Animated.View entering={FadeIn.delay(300)} exiting={FadeOut}>
				<LottieView
					style={{
						aspectRatio: 1,
						width: 400
					}}
					resizeMode='contain'
					autoPlay
					loop={true}
					source={require('assets/lottie/loader-particles.json')}
				/>
			</Animated.View>

			<InfiniteFade>
				<Animated.Text
					style={{
						fontFamily: styles.font.family,
						bottom: 200,
						alignSelf: 'center',
						color: styles.theme.colors[activeTheme].text,
						fontSize: styles.font.size.md
					}}
				>
					Analyzing...
				</Animated.Text>
			</InfiniteFade>
		</View>
	) : (
		<>
			<SearchResultBottomSheet
				ref={searchRef}
				activeTheme={activeTheme}
				items={formatSearchResults()}
			/>

			<Animated.View
				style={{
					backgroundColor: styles.theme.colors.primary,
					paddingHorizontal: styles.spacing.double_xl,
					paddingTop: 62,
					paddingBottom: styles.spacing.double_xxl,
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					onPress={router.back}
					style={{
						paddingRight: styles.spacing.xxl
					}}
				>
					<ChevronLeft color={styles.icon.colors._05} size={styles.icon.size.xl} />
				</TouchableOpacity>
				<View>
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.xl,
							fontWeight: styles.font.weight.bold,
							color: styles.font.colors._04
						}}
					>
						Manual Input
					</Text>
				</View>
			</Animated.View>

			<Animated.View
				entering={FadeIn}
				exiting={FadeOut}
				style={{
					rowGap: styles.spacing.one_xl,
					padding: styles.spacing.one_xl,
					backgroundColor: styles.theme.colors[activeTheme].screen_background,
					flex: 1
				}}
			>
				<Animated.View
					layout={LinearTransition.springify().damping(120)}
					style={{
						position: 'static',
						overflow: 'hidden',
						padding: styles.spacing.one_xl,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderRadius: styles.border.radius.size.sm,
						rowGap: styles.spacing.md,
						paddingBottom: styles.spacing.one_xl
					}}
				>
					<Text
						style={{
							fontWeight: styles.font.weight.semi_bold,
							fontSize: styles.font.size.md,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Input Ingredients
					</Text>

					{!inputIngredientVisible && (
						<AnimatedTouchableOpacity
							entering={FadeIn}
							exiting={FadeOut.duration(180)}
							disabled={ingredients.length <= 0}
							activeOpacity={0.7}
							onPress={onNextProductInput}
							style={[
								{
									position: 'absolute',
									right: 70,
									alignSelf: 'center',
									flexDirection: 'row',
									marginTop: styles.spacing.xl,
									width: 70,
									height: 28,
									paddingVertical: styles.spacing.sm,

									backgroundColor: styles.theme.colors.primary,
									borderRadius: styles.border.radius.size.sm,
									alignItems: 'center',
									justifyContent: 'center',
									columnGap: styles.spacing.sm
								}
							]}
						>
							<>
								<Animated.Text
									style={{
										fontFamily: styles.font.family,
										color: styles.font.colors._04,
										fontSize: styles.font.size.sm
									}}
								>
									Edit
								</Animated.Text>

								<Edit size={styles.icon.size.md} color={styles.icon.colors._05} />
							</>
						</AnimatedTouchableOpacity>
					)}

					{!inputIngredientVisible && (
						<AnimatedTouchableOpacity
							onPress={onShowOnlyIngredients}
							entering={FadeIn}
							exiting={FadeOut.duration(180)}
							style={{
								position: 'absolute',
								alignSelf: 'center',
								zIndex: 999,
								right: 40,
								top: 34
							}}
						>
							{ingredientsVisible ? (
								<Eye
									color={styles.theme.colors[activeTheme].icon}
									size={styles.icon.size.xl}
								/>
							) : (
								<EyeClosed
									color={styles.theme.colors[activeTheme].icon}
									size={styles.icon.size.xl}
								/>
							)}
						</AnimatedTouchableOpacity>
					)}

					{inputIngredientVisible && (
						<Animated.View
							entering={entryScaleHeight}
							exiting={exitScaleAnimation}
							style={{
								alignItems: 'center',
								flexDirection: 'row',
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].card_border,
								backgroundColor: styles.theme.colors[activeTheme].input_background,
								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.sm,
								columnGap: styles.spacing.sm,
								overflow: 'hidden'
							}}
						>
							<Search
								style={{ marginLeft: styles.spacing.md }}
								strokeWidth={1.5}
								color={styles.theme.colors[activeTheme].icon}
								size={styles.icon.size.xl}
							/>
							<TextInput
								selectionColor={styles.theme.colors.primary}
								cursorColor={styles.theme.colors.primary}
								style={{
									flexGrow: 1,

									fontFamily: styles.font.family,
									fontSize: styles.font.size.md,
									color: styles.theme.colors[activeTheme].text
								}}
								placeholderTextColor={styles.theme.colors[activeTheme].text + '9a'}
								onSubmitEditing={(e) => {
									onSearchIngredient(e.nativeEvent.text);
								}}
								maxLength={32}
								enterKeyHint='search'
								autoCapitalize='characters'
								underlineStyle={{ display: 'none' }}
								placeholder='Type an ingredients here...'
							/>

							{searchQuery.isPending && (
								<Animated.View
									style={{ position: 'absolute', right: 16 }}
									entering={FadeIn}
									exiting={FadeOut}
								>
									<ActivityIndicator
										size={styles.icon.size.xl * 1.2}
										color={styles.theme.colors.primary}
									/>
								</Animated.View>
							)}
						</Animated.View>
					)}

					{inputIngredientVisible && ingredients.length === 0 && (
						<Animated.View
							entering={entryScaleHeight}
							exiting={exitScaleAnimation}
							style={{
								marginVertical: styles.spacing.lg
							}}
							layout={LinearTransition.springify().damping(200)}
						>
							<View
								style={{
									padding: styles.spacing.lg,
									borderRadius: styles.border.radius.size.sm,
									backgroundColor: styles.theme.colors[activeTheme].disclaimer_background,
									borderWidth: 1,
									borderColor: styles.theme.colors[activeTheme].disclaimer_border
								}}
							>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].disclaimer_text,
										fontWeight: styles.font.weight.bold,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									Your ingredient list is empty.
								</Text>
								<Text
									style={{
										color: styles.theme.colors[activeTheme].disclaimer_text,
										fontFamily: styles.font.family,
										fontSize: styles.font.size.sm
									}}
								>
									Use the search bar to find and add ingredient.
								</Text>
							</View>
						</Animated.View>
					)}

					{(isVisible || ingredientsVisible) && (
						<Animated.View
							entering={entryScaleHeight}
							exiting={exitScaleAnimation}
							layout={LinearTransition.springify().damping(200).stiffness()}
							style={{
								flexDirection: 'row',
								flexWrap: 'wrap',
								marginTop: styles.spacing.xxl,
								gap: styles.spacing.lg
							}}
						>
							{ingredients?.map(({ name, id }) => {
								return (
									<AnimatedTouchableOpacity
										onPress={onRemoveIngredient(id)}
										layout={LinearTransition.springify().damping(120)}
										activeOpacity={0.7}
										disabled={!inputIngredientVisible && ingredientsVisible}
										style={{
											backgroundColor: styles.theme.colors.primary,
											opacity: !inputIngredientVisible && ingredientsVisible ? 0.5 : 1,
											borderRadius: styles.border.radius.size.pill,
											transitionDuration: 200,
											flexDirection: 'row',
											alignItems: 'center',
											paddingVertical: styles.spacing.md,
											paddingHorizontal: styles.spacing.xl,
											justifyContent: 'center',
											columnGap: styles.spacing.sm
										}}
										key={name}
									>
										<Text
											style={{
												fontFamily: styles.font.family,
												fontSize: styles.font.size.sm,
												color: styles.font.colors._04
											}}
										>
											{name}
										</Text>

										{inputIngredientVisible && (
											<Animated.View entering={FadeIn}>
												<X
													size={styles.icon.size.md}
													strokeWidth={1.5}
													color={styles.icon.colors._05}
												/>
											</Animated.View>
										)}
									</AnimatedTouchableOpacity>
								);
							})}
						</Animated.View>
					)}
					{inputIngredientVisible && (
						<Animated.View
							entering={entryScaleHeight}
							exiting={exitScaleAnimation}
							style={{
								marginTop: styles.spacing.xl,
								borderRadius: styles.border.radius.size.sm,
								borderWidth: 1,
								borderColor: styles.theme.colors[activeTheme].tip_border,
								backgroundColor: styles.theme.colors[activeTheme].tip_background
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									columnGap: styles.spacing.md,
									padding: styles.spacing.md
								}}
							>
								<View
									style={{
										marginTop: styles.spacing.md
									}}
								>
									<Info
										size={styles.icon.size.md}
										color={styles.theme.colors[activeTheme].tip_icon}
									/>
								</View>

								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].tip_text,
										paddingRight: styles.spacing.double_xl
									}}
								>
									Tip:{' '}
									<Text>
										Type ingredients exactly as they appear on the label. Select from the
										suggestions or tap 'Add' to include them.
									</Text>
								</Text>
							</View>
						</Animated.View>
					)}

					{inputIngredientVisible && (
						<Animated.View
							style={{
								marginTop: styles.spacing.lg,
								paddingVertical: styles.spacing.xl,
								borderRadius: styles.border.radius.size.sm,
								backgroundColor: styles.theme.colors.primary,
								opacity: ingredients.length <= 0 ? 0.5 : 1
							}}
						>
							<TouchableOpacity
								entering={FadeIn}
								exiting={FadeOut.duration(180)}
								disabled={ingredients.length <= 0}
								activeOpacity={0.7}
								onPress={onNextProductInput}
								style={[
									{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center',
										columnGap: styles.spacing.xs
									}
								]}
							>
								<>
									<Animated.Text
										style={{
											fontFamily: styles.font.family,
											color: styles.font.colors._04,
											fontSize: styles.font.size.md
										}}
									>
										Next
									</Animated.Text>

									<ArrowRight size={styles.icon.size.lg} color={styles.icon.colors._05} />
								</>
							</TouchableOpacity>
						</Animated.View>
					)}
				</Animated.View>
				<Animated.View
					layout={LinearTransition.springify().damping(120)}
					style={{
						padding: styles.spacing.one_xl,
						borderWidth: 1,
						borderColor: styles.theme.colors[activeTheme].card_border,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderRadius: styles.border.radius.size.sm,
						rowGap: styles.spacing.md
					}}
				>
					<Text
						style={{
							fontWeight: styles.font.weight.semi_bold,
							fontSize: styles.font.size.md,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						Product Information
					</Text>

					{!inputIngredientVisible && (
						<Animated.View
							entering={entryScaleHeight}
							exiting={FadeOut.duration(120)}
							style={{ zIndex: -999, rowGap: styles.spacing.xxl }}
						>
							<View
								style={{
									rowGap: styles.spacing.sm,
									marginTop: styles.spacing.sm,
									zIndex: -999
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Name <Text style={{ color: styles.theme.colors.status.red }}>*</Text>
								</Text>
								<Controller
									control={control}
									name='name'
									render={({ field: { value, onChange }, fieldState: { error } }) => {
										return (
											<Animated.View
												style={{
													borderWidth: 0.5,
													borderColor: error
														? styles.theme.colors.status.red
														: 'transparent',
													borderRadius: styles.border.radius.size.sm,
													backgroundColor:
														styles.theme.colors[activeTheme].input_background,
													transitionDuration: 220
												}}
											>
												<TextInput
													onSubmitEditing={() => brandInputRef.current?.focus()}
													selectionColor={styles.theme.colors.primary}
													cursorColor={styles.theme.colors.primary}
													style={{
														flexGrow: 1,
														paddingHorizontal: styles.spacing.lg,

														fontFamily: styles.font.family,
														fontSize: styles.font.size.sm,
														color: styles.theme.colors[activeTheme].text
													}}
													value={value}
													placeholderTextColor={
														styles.theme.colors[activeTheme].text + '9a'
													}
													onChangeText={onChange}
													maxLength={100}
													submitBehavior='submit'
													enterKeyHint='next'
													autoCapitalize='characters'
													autoFocus={true}
													placeholder='e.g., Hydrating Sunscreen'
												/>
											</Animated.View>
										);
									}}
								/>
							</View>

							<View
								style={{
									rowGap: styles.spacing.sm,
									marginTop: styles.spacing.sm,
									zIndex: -999
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Brand{' '}
									<Text
										style={{
											color: styles.theme.colors[activeTheme].text_secondary + '7a'
										}}
									>
										(optional)
									</Text>
								</Text>

								<Controller
									control={control}
									name='brand'
									render={({ field: { value, onChange } }) => {
										return (
											<TextInput
												value={value}
												ref={brandInputRef}
												onSubmitEditing={() => notesInputRef.current?.focus()}
												selectionColor={styles.theme.colors.primary}
												cursorColor={styles.theme.colors.primary}
												style={{
													flexGrow: 1,
													paddingHorizontal: styles.spacing.lg,
													borderRadius: styles.border.radius.size.sm,
													backgroundColor:
														styles.theme.colors[activeTheme].input_background,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.sm,
													color: styles.theme.colors[activeTheme].text
												}}
												submitBehavior='submit'
												placeholderTextColor={
													styles.theme.colors[activeTheme].text + '9a'
												}
												onChangeText={onChange}
												maxLength={100}
												enterKeyHint='next'
												autoCapitalize='characters'
												placeholder='e.g., BeauWise Naturals'
											/>
										);
									}}
								/>
							</View>

							<View
								style={{
									rowGap: styles.spacing.sm,
									marginTop: styles.spacing.sm,
									zIndex: -999
								}}
							>
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Notes{' '}
									<Text
										style={{
											color: styles.theme.colors[activeTheme].text_secondary + '7a'
										}}
									>
										(optional)
									</Text>
								</Text>

								<Controller
									control={control}
									name='notes'
									render={({ field: { value, onChange } }) => {
										return (
											<TextInput
												value={value}
												onChangeText={onChange}
												ref={notesInputRef}
												selectionColor={styles.theme.colors.primary}
												cursorColor={styles.theme.colors.primary}
												style={{
													flexGrow: 1,
													paddingHorizontal: styles.spacing.lg,
													borderRadius: styles.border.radius.size.sm,
													backgroundColor:
														styles.theme.colors[activeTheme].input_background,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.sm,
													color: styles.theme.colors[activeTheme].text
												}}
												placeholderTextColor={
													styles.theme.colors[activeTheme].text + '9a'
												}
												multiline={true}
												submitBehavior='blurAndSubmit'
												enterKeyHint='done'
												autoCapitalize='characters'
												placeholder='Any specific concerns or details...'
											/>
										);
									}}
								/>
							</View>
						</Animated.View>
					)}
				</Animated.View>
				<TouchableOpacity
					disabled={productName.length <= 0 || ingredients.length <= 0}
					onPress={handleSubmit(onAnalyzeIngredients)}
					activeOpacity={0.7}
					style={[
						{
							opacity: productName.length <= 0 || ingredients.length <= 0 ? 0.5 : 1,
							position: 'absolute',
							bottom: 90,
							marginTop: styles.spacing.xl,
							backgroundColor: styles.theme.colors.primary,
							borderRadius: styles.border.radius.size.pill,
							alignSelf: 'center',
							padding: styles.spacing.xxl
						},
						styles.shadow.md
					]}
				>
					<Text
						style={{
							fontFamily: styles.font.family,
							color: styles.font.colors._04,
							fontSize: styles.font.size.md
						}}
					>
						<AiBeautify color={styles.icon.colors._05} />
					</Text>
				</TouchableOpacity>
			</Animated.View>

			<Portal>
				<Modal visible={modalVisible}>
					<View
						style={{
							rowGap: styles.spacing.one_xl,
							padding: styles.spacing.one_xxl,
							alignSelf: 'center',
							backgroundColor: styles.theme.colors[activeTheme].screen_background,
							borderRadius: styles.border.radius.size.sm
						}}
					>
						<Text
							style={{
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Are you sure you want to cancel the analysis?
						</Text>

						<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									paddingHorizontal: styles.spacing.three_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text style={{ color: styles.theme.colors[activeTheme].text }}>No</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={router.back}
								activeOpacity={0.7}
								style={{
									paddingVertical: styles.spacing.lg,
									backgroundColor: styles.theme.colors.primary,
									paddingHorizontal: styles.spacing.one_xxl,
									borderRadius: styles.border.radius.size.sm
								}}
							>
								<Text
									style={{
										fontFamily: styles.font.family,
										color: styles.font.colors._04
									}}
								>
									Yes
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</Portal>
		</>
	);
}
