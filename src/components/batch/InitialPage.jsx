import styles from '@/config/styles';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ShieldCheck from '../icons/hugeicons/ShieldCheck';
import { Circle } from 'lucide-react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import Warn from '../icons/hugeicons/Warn';
import { useRef, useState } from 'react';
import { entryScaleHeight, exitScaleAnimation } from '@/utility/animations';
import InputNumeric from '../icons/hugeicons/InputNumeric';
import BatchSelect from './Select';
import { arrayUnion, doc, Timestamp, updateDoc } from '@react-native-firebase/firestore';
import { auth } from '@/services/auth';
import BatchBottomSheet from './BatchBottomSheet';
import { Controller } from 'react-hook-form';

const fdaSchema = [
	{
		title: 'What does FDA verification mean?',
		definitions: [
			'The product has an active FDA notification authorizing legal market distribution in the Philippines.',
			'The product formulation is subject to FDA regulatory requirements regarding prohibited and restricted substances.',
			'The manufacturer or distributor holds an active notification status with the FDA.',
			'The product complies with baseline FDA notification requirements.'
		]
	},

	{
		name: 'Product Name',
		placeholder: 'Enter product name or brand...'
	},
	{
		name: 'Notification No.',
		placeholder: 'Enter NN - code (e.g. NN-12678...)'
	}
];

export default function InitialPage({ onSubmit, activeTheme, control }) {
	const batchSheetModalRef = useRef(null);

	const handlePresentModalPress = () => {
		batchSheetModalRef.current?.present();
	};

	return (
		<>
			<TouchableOpacity
				onPress={onSubmit}
				activeOpacity={0.7}
				style={{
					borderRadius: styles.border.radius.size.sm,
					alignSelf: 'center',
					position: 'absolute',
					bottom: 120,
					backgroundColor: styles.theme.colors.batch,
					width: '80%',
					paddingVertical: styles.spacing.xl,
					alignItems: 'center',
					zIndex: 3
				}}
			>
				<Text
					style={{
						fontFamily: styles.font.family,
						color: styles.font.colors._04
					}}
				>
					Verify
				</Text>
			</TouchableOpacity>

			<Animated.View
				entering={entryScaleHeight}
				exiting={exitScaleAnimation}
				style={{
					position: 'absolute',
					alignSelf: 'center',
					top: 110,
					rowGap: styles.spacing.one_xxl
				}}
			>
				<View
					style={{
						alignSelf: 'center',
						width: '92%',
						alignItems: 'center',
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xxl,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderColor: styles.theme.colors[activeTheme].card_border,
						borderWidth: 1,
						rowGap: styles.spacing.one_xl
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.lg
						}}
					>
						<InputNumeric
							color={styles.theme.colors.batch}
							size={styles.icon.size.xl * 1.4}
						/>
						<Text
							style={{
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							About Batch Codes
						</Text>
					</View>
					<Text
						style={{
							lineHeight: styles.spacing.double_xl,
							fontSize: styles.font.size.sm,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						Batch codes are manufacturer-assigned alphanumeric identifiers used for
						product tracking and production reference. They may help estimate a product’s
						manufacturing date and unopened shelf life based on brand-specific coding
						systems.
					</Text>

					<Text
						style={{
							lineHeight: styles.spacing.double_xl,
							fontSize: styles.font.size.sm,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text_secondary
						}}
					>
						These codes are commonly stamped or printed on the bottom of the packaging,
						near the barcode, on the crimped edge of tubes, or at the base of jars and
						bottles.
					</Text>
				</View>

				<Animated.View
					layout={LinearTransition.springify().damping(120)}
					style={[
						{
							alignSelf: 'center',
							width: '92%',
							alignItems: 'center',
							borderRadius: styles.border.radius.size.sm,
							padding: styles.spacing.one_xxl,
							backgroundColor: styles.theme.colors[activeTheme].card_background,
							borderColor: styles.theme.colors[activeTheme].card_border,
							borderWidth: 1,
							rowGap: styles.spacing.one_xxl
						}
					]}
				>
					<View style={{ width: '100%', rowGap: styles.spacing.one_xl }}>
						<View>
							<Controller
								control={control}
								name='brand'
								render={({ field: { value }, fieldState: { error } }) => {
									return (
										<>
											{error && (
												<Animated.Text
													exiting={FadeOut}
													entering={FadeIn}
													style={{
														position: 'absolute',
														color: styles.theme.colors.status.red,
														fontFamily: styles.font.family,
														fontSize: styles.font.size.sm,
														zIndex: 2,
														right: 6,
														top: 0
													}}
												>
													{error.message}
												</Animated.Text>
											)}

											<BatchSelect
												error={error?.message}
												activeTheme={activeTheme}
												handleSelect={handlePresentModalPress}
												brandText={value?.text}
											/>
										</>
									);
								}}
							/>
						</View>

						<View style={{ rowGap: styles.spacing.sm }}>
							<Text
								style={{
									fontFamily: styles.font.family,
									fontSize: styles.font.size.sm,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								Enter Batch Code
							</Text>
							<Controller
								control={control}
								name='code'
								render={({
									field: { onChange, onBlur, value },
									fieldState: { error }
								}) => (
									<Animated.View
										style={{
											paddingHorizontal: styles.spacing.xl,
											borderRadius: styles.border.radius.size.sm,
											width: '100%',
											borderWidth: 1,
											backgroundColor: styles.theme.colors[activeTheme].input_background,
											borderColor: error
												? styles.theme.colors.status.red
												: styles.theme.colors[activeTheme].input_border,
											transitionDuration: 300
										}}
									>
										{error && (
											<Animated.Text
												exiting={FadeOut}
												entering={FadeIn}
												style={{
													position: 'absolute',
													color: styles.theme.colors.status.red,
													fontFamily: styles.font.family,
													fontSize: styles.font.size.sm,
													zIndex: 2,
													right: 6,
													top: -16
												}}
											>
												{error.message}
											</Animated.Text>
										)}

										<TextInput
											value={value}
											style={{
												color: styles.theme.colors[activeTheme].text,

												fontFamily: styles.font.family,
												fontSize: styles.font.size.md
											}}
											onBlur={onBlur}
											autoCapitalize='characters'
											onChangeText={onChange}
											placeholderTextColor={
												styles.theme.colors[activeTheme].text_secondary
											}
											cursorColor={styles.theme.colors.batch}
											selectionColor={styles.theme.colors.batch}
											selectionHandleColor={styles.theme.colors.batch}
											placeholder={'e.g., 23C05A'}
										/>
									</Animated.View>
								)}
							/>
						</View>
					</View>
				</Animated.View>
			</Animated.View>

			<BatchBottomSheet
				control={control}
				activeTheme={activeTheme}
				batchSheetModalRef={batchSheetModalRef}
			/>
		</>
	);
}
