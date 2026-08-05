import styles from '@/config/styles';
import { Text, TouchableOpacity, View } from 'react-native';

import Warn from '../icons/hugeicons/Warn';
import Warn2 from '../icons/hugeicons/Warn2';
import Check from '../icons/hugeicons/Check';
import Label from '../icons/hugeicons/Label';
import Align from '../icons/hugeicons/Align';
import Work from '../icons/hugeicons/Work';
import CalendarDisable from '../icons/hugeicons/CalendarDisable';
import CalendarCheck from '../icons/hugeicons/CalendarCheck';
import CalendarClock from '../icons/hugeicons/CalendarClock';
import { useState } from 'react';

import Animated, {
	LinearTransition,
	scrollTo,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import Info from '../icons/hugeicons/Info';
import { InfoIcon } from 'lucide-react-native';
import {
	exitScaleAnimation,
	exitStaggerCardAnimation,
	scaleAnimation,
	staggerCardAnimation
} from '@/utility/animations';
import DeliveryBox from '../icons/hugeicons/DeliveryBox';
import Pie from '../icons/hugeicons/Pie';
import Calendar from '../icons/hugeicons/Calendar';

const resultSchema = {
	product: {
		title: 'product',
		icon: (size, color) => <Label size={size} color={color} />
	},
	company: {
		title: 'company',
		icon: (size, color) => <Work size={size} color={color} />
	},
	notification_number: {
		title: 'notification no.',
		icon: (size, color) => <Align size={size} color={color} />
	},
	product_validity_date: {
		title: 'valid until',
		icon: (size, color, isExpired) =>
			isExpired ? (
				<CalendarDisable size={size} color={color} />
			) : (
				<CalendarCheck size={size} color={color} />
			)
	},
	verification_check_date: {
		title: 'verification checked',
		icon: (size, color) => <CalendarClock size={size} color={color} />
	}
};

const statusSchema = [
	{
		name: 'active',
		title: 'Freshness Verified',
		description: 'Valid batch code detected'
	},
	{
		name: 'expired',
		title: 'Estimated Shelf Life Expired',
		description:
			'This batch code indicates the product is beyond its estimated unopened shelf life.',
		warning_message: [
			'This product appears to have exceeded its estimated unopened shelf life.',
			'Expired cosmetic and skincare products may experience reduced effectiveness, ingredient instability, texture changes, or increased risk of contamination over time. Avoid using the product if you notice unusual odor, discoloration, separation, texture changes, or skin irritation.'
		]
	},
	{
		name: 'not_found',
		title: 'Invalid Code or Not Found',
		description: `We could not decode this batch code. It may be invalid, incorrectly entered, or not yet supported in our database.`,
		advice_message: [
			'Make sure you selected the correct brand from the dropdown and entered the batch code instead of the barcode number.',
			'Batch codes are usually short alphanumeric sequences such as “23C05A” or “1A92”, commonly printed on the bottom of the container, near the barcode, or on the crimped edge of tubes.',
			'If the code is correct, the manufacturer may have updated its coding system or the brand may not yet be fully supported.'
		]
	}
];

// const resultMock = {
// 	brand: 'Sunsilk',
// 	code: '2BS6A',
// 	manufacture_date: 'October 2025',
// 	current_age: '4 Years, 5 Months',
// 	estimated_expiration: 'January 2025',
// 	is_invalid: true,
// 	verification_check_date: 'May 7, 2026 at 01:13 PM'
// };

export default function ResultPage({ activeTheme, results, onPress, buttonText = null }) {
	const animatedScrollRef = useAnimatedRef(null);

	const scrollTopRef = useSharedValue(110);

	const animatedPositionScroll = useAnimatedStyle(() => {
		return {
			top: scrollTopRef.value
		};
	});

	results = { ...results?.data };

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			if (e.contentOffset.y === 0) {
				scrollTopRef.value = withTiming(110, { duration: 200 });
			}

			if (e.contentOffset.y < 0) {
				scrollTo(animatedScrollRef, 0, 0, true);
			}

			if (e.contentOffset.y > 0) {
				scrollTopRef.value = withTiming(126, { duration: 200 });
			}
		}
	});

	return (
		<>
			<Animated.ScrollView
				exiting={exitScaleAnimation}
				showsVerticalScrollIndicator={false}
				onScroll={scrollHandler}
				ref={animatedScrollRef}
				style={[
					{
						position: 'absolute',
						alignSelf: 'center',
						bottom: 0,
						width: '90%'
					},
					animatedPositionScroll
				]}
				contentContainerStyle={{
					rowGap: styles.spacing.one_xxl,
					paddingBottom: 50
				}}
			>
				<Animated.View
					entering={scaleAnimation}
					style={{
						alignSelf: 'center',

						alignItems: 'center',
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xxl,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderColor: styles.theme.colors[activeTheme].card_border,
						borderWidth: 1,
						width: '100%',
						rowGap: styles.spacing.one_xxl
					}}
				>
					<View
						style={{
							rowGap: styles.spacing.xl,
							alignItems: 'center',
							columnGap: styles.spacing.lg
						}}
					>
						{results.is_invalid ? (
							<Warn
								size={styles.icon.size.xl * 2}
								color={styles.theme.colors.status.yellow}
							/>
						) : results?.is_expired ? (
							<Warn2
								size={styles.icon.size.xl * 2}
								color={styles.theme.colors.status.red}
							/>
						) : (
							<Check
								size={styles.icon.size.xl * 2}
								color={styles.theme.colors.status.green}
							/>
						)}

						<Text
							style={{
								fontWeight: styles.font.weight.semi_bold,
								fontSize: styles.font.size.xl,
								fontFamily: styles.font.family,
								color: results?.is_invalid
									? styles.theme.colors.status.yellow
									: results?.is_expired
										? styles.theme.colors.status.red
										: styles.theme.colors.status.green
							}}
						>
							{results?.is_invalid
								? statusSchema[2].title
								: results?.is_expired
									? statusSchema[1].title
									: statusSchema[0].title}
						</Text>

						<Text
							style={{
								textAlign: 'center',

								fontFamily: styles.font.family,
								fontSize: styles.font.size.md,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							{results?.is_invalid
								? statusSchema[2].description
								: results?.is_expired
									? statusSchema[1].description
									: statusSchema[0].description}
						</Text>
					</View>
				</Animated.View>

				<Animated.View
					entering={staggerCardAnimation(1)}
					key={'first-card'}
					style={{
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xl,
						backgroundColor: styles.theme.colors[activeTheme].batch_background,
						borderColor: styles.theme.colors[activeTheme].batch_border,
						flexDirection: 'row',
						borderWidth: 1,
						rowGap: styles.spacing.md
					}}
				>
					<View
						style={{
							rowGap: styles.spacing.lg
						}}
					>
						<Text
							style={{
								textTransform: 'capitalize',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Brand
						</Text>
						<Text
							style={{
								textTransform: 'capitalize',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Batch Code
						</Text>
					</View>

					<View
						style={{
							marginLeft: 'auto',
							rowGap: styles.spacing.lg
						}}
					>
						<Text
							style={{
								textTransform: 'capitalize',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								fontWeight: styles.font.weight.bold,
								color: styles.theme.colors[activeTheme].batch_text
							}}
						>
							{results.brand}
						</Text>
						<Text
							style={{
								fontWeight: styles.font.weight.bold,
								textTransform: 'capitalize',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].batch_text
							}}
						>
							{results.code}
						</Text>
					</View>
				</Animated.View>

				{!results?.is_invalid && (
					<>
						<View style={{ flexDirection: 'row', columnGap: styles.spacing.one_xxl }}>
							<Animated.View
								entering={staggerCardAnimation(2)}
								key={'first-card'}
								style={{
									flex: 1,
									borderRadius: styles.border.radius.size.sm,
									padding: styles.spacing.one_xl,
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									borderColor: styles.theme.colors[activeTheme].card_border,

									borderWidth: 1,
									rowGap: styles.spacing.md
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										columnGap: styles.spacing.md
									}}
								>
									<DeliveryBox
										size={styles.icon.size.xl}
										color={styles.theme.colors.batch}
									/>

									<Text
										style={{
											textTransform: 'capitalize',
											fontSize: styles.font.size.md,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										Manufactured
									</Text>
								</View>

								<Text
									style={{
										textTransform: 'capitalize',
										fontWeight: styles.font.weight.bold,
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{results.manufacture_date}
								</Text>
							</Animated.View>

							<Animated.View
								entering={staggerCardAnimation(3)}
								key={'second-card'}
								style={{
									flex: 1,
									borderRadius: styles.border.radius.size.sm,
									padding: styles.spacing.one_xl,
									backgroundColor: styles.theme.colors[activeTheme].card_background,
									borderColor: styles.theme.colors[activeTheme].card_border,

									borderWidth: 1,
									rowGap: styles.spacing.md
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										columnGap: styles.spacing.md
									}}
								>
									<Pie size={styles.icon.size.xl} color={styles.theme.colors.batch} />

									<Text
										style={{
											textTransform: 'capitalize',
											fontSize: styles.font.size.md,
											fontFamily: styles.font.family,
											color: styles.theme.colors[activeTheme].text
										}}
									>
										Current Age
									</Text>
								</View>

								<Text
									style={{
										textTransform: 'capitalize',
										fontWeight: styles.font.weight.bold,
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{results.current_age}
								</Text>
							</Animated.View>
						</View>

						<Animated.View
							entering={staggerCardAnimation(4)}
							key={'third-card'}
							style={{
								flex: 1,
								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.one_xl,
								backgroundColor: styles.theme.colors[activeTheme].card_background,
								borderColor: styles.theme.colors[activeTheme].card_border,

								borderWidth: 1,
								rowGap: styles.spacing.md
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									columnGap: styles.spacing.md
								}}
							>
								<Calendar size={styles.icon.size.xl} color={styles.theme.colors.batch} />

								<Text
									style={{
										textTransform: 'capitalize',
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									Estimated Expiry
								</Text>
							</View>

							<Text
								style={{
									textTransform: 'capitalize',
									fontWeight: styles.font.weight.bold,
									fontSize: styles.font.size.md,
									fontFamily: styles.font.family,
									color: styles.theme.colors[activeTheme].text
								}}
							>
								{results.estimated_expiration}
							</Text>
						</Animated.View>
					</>
				)}

				<Animated.View
					entering={staggerCardAnimation(results?.is_invalid ? 2 : 5)}
					key={'fourth-card'}
					style={{
						flex: 1,
						borderRadius: styles.border.radius.size.sm,
						padding: styles.spacing.one_xl,
						backgroundColor: styles.theme.colors[activeTheme].card_background,
						borderColor: styles.theme.colors[activeTheme].card_border,

						borderWidth: 1,
						rowGap: styles.spacing.md
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							columnGap: styles.spacing.md
						}}
					>
						<CalendarClock size={styles.icon.size.xl} color={styles.theme.colors.batch} />

						<Text
							style={{
								textTransform: 'capitalize',
								fontSize: styles.font.size.md,
								fontFamily: styles.font.family,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							Verificaton Checked
						</Text>
					</View>

					<Text
						style={{
							textTransform: 'capitalize',
							fontWeight: styles.font.weight.bold,
							fontSize: styles.font.size.md,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{results.verification_check_date}
					</Text>
				</Animated.View>

				{results?.is_expired && (
					<Animated.View
						entering={staggerCardAnimation(6)}
						style={{
							borderRadius: styles.border.radius.size.sm,
							rowGap: styles.spacing.lg,
							padding: styles.spacing.xxl,
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].warn_border,
							backgroundColor: styles.theme.colors[activeTheme].warn_background
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',

								columnGap: styles.spacing.md
							}}
						>
							<View>
								<InfoIcon
									strokeWidth={1.5}
									size={styles.icon.size.lg}
									color={styles.theme.colors[activeTheme].warn_icon}
								/>
							</View>

							<Text
								style={{
									fontSize: styles.font.size.sm,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									color: styles.theme.colors[activeTheme].warn_text
								}}
							>
								Warning
							</Text>
						</View>

						<View style={{ rowGap: styles.spacing.lg }}>
							{statusSchema[1].warning_message.map((message) => (
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].warn_text
									}}
									key={message}
								>
									{message}
								</Text>
							))}
						</View>
					</Animated.View>
				)}

				{results?.is_invalid && (
					<Animated.View
						entering={staggerCardAnimation(3)}
						style={{
							borderRadius: styles.border.radius.size.sm,
							rowGap: styles.spacing.lg,
							padding: styles.spacing.xxl,
							borderWidth: 1,
							borderColor: styles.theme.colors[activeTheme].disclaimer_border,
							backgroundColor: styles.theme.colors[activeTheme].disclaimer_background
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',

								columnGap: styles.spacing.md
							}}
						>
							<View>
								<InfoIcon
									strokeWidth={1.5}
									size={styles.icon.size.lg}
									color={styles.theme.colors[activeTheme].disclaimer_icon}
								/>
							</View>

							<Text
								style={{
									fontSize: styles.font.size.sm,
									fontFamily: styles.font.family,
									fontWeight: styles.font.weight.semi_bold,
									color: styles.theme.colors[activeTheme].disclaimer_text
								}}
							>
								Actionable Advice
							</Text>
						</View>

						<View style={{ rowGap: styles.spacing.lg }}>
							{statusSchema[2].advice_message.map((message) => (
								<Text
									style={{
										fontSize: styles.font.size.sm,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].disclaimer_text
									}}
									key={message}
								>
									{message}
								</Text>
							))}
						</View>
					</Animated.View>
				)}

				<Animated.View
					entering={staggerCardAnimation(
						results?.is_expired ? 7 : results?.is_invalid ? 4 : 6
					)}
				>
					<TouchableOpacity
						onPress={onPress}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							alignSelf: 'center',
							marginTop: styles.spacing.lg,
							backgroundColor: styles.theme.colors.batch,
							width: '90%',
							paddingVertical: styles.spacing.xl,
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								textTransform: 'capitalize',
								fontFamily: styles.font.family,
								color: styles.font.colors._04
							}}
						>
							{buttonText ? buttonText : 'check another code'}
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</Animated.ScrollView>
		</>
	);
}
