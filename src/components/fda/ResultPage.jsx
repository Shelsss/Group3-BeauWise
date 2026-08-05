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
		title: 'Active FDA Notification',
		description:
			'This product has an active Certificate of Product Notification (CPN) with the FDA Philippines.'
	},
	{
		name: 'expired',
		title: 'FDA Notification Expired',
		description: 'The FDA notification validity for this product has expired.',
		warning_message: [
			'This product previously held FDA notification status, but its authorization is no longer active.',
			'Current regulatory compliance could not be confirmed. For safety and compliance purposes, consumers are strongly encouraged to purchase products with active FDA notifications.'
		]
	},
	{
		name: 'not_found',
		title: 'Unverified / No Record Found',
		description: `We couldn't find a matching record in the database.`,
		advice_message: [
			'We could not verify an active Certificate of Product Notification (CPN) or matching registered notification record based on your search input in the FDA Philippines database.',
			'Please verify the spelling of the product name or try searching using the exact Notification Number (e.g., NN-10000...) found on the packaging.',
			'Exercise caution when purchasing or using unverified products, as they may be unregistered, counterfeit, expired, or non-compliant with regulatory requirements.'
		]
	}
];

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
				{
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
							{results?.is_invalid ? (
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
				}

				{Object.keys(resultSchema).map((key, index) => {
					const props = resultSchema[key];

					const animationTiming = index + 1;

					const animationTimingForInvalid =
						key === 'verification_check_date' && results?.is_invalid
							? 2
							: animationTiming;
					return (
						<Animated.View
							entering={staggerCardAnimation(animationTimingForInvalid)}
							key={key}
							style={{
								display: !results?.is_invalid
									? 'flex'
									: results?.is_invalid &&
										  (key === 'product' || key === 'verification_check_date')
										? 'flex'
										: 'none',

								borderRadius: styles.border.radius.size.sm,
								padding: styles.spacing.xxl,
								backgroundColor:
									key === 'product'
										? styles.theme.colors[activeTheme].fda_background
										: styles.theme.colors[activeTheme].card_background,
								borderColor:
									key === 'product'
										? styles.theme.colors[activeTheme].fda_border
										: key === 'product_validity_date' && results?.is_expired
											? styles.theme.colors.status.red
											: styles.theme.colors[activeTheme].card_border,
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
								{props?.icon(
									styles.icon.size.xl,
									key === 'product_validity_date' && results?.is_expired
										? styles.theme.colors.status.red
										: styles.theme.colors.status.green,
									results?.is_expired
								)}

								<Text
									style={{
										textTransform: 'capitalize',
										fontSize: styles.font.size.md,
										fontFamily: styles.font.family,
										color: styles.theme.colors[activeTheme].text
									}}
								>
									{results?.is_invalid && index === 0
										? 'Product / Notification No.'
										: props?.title}
								</Text>
							</View>

							<Text
								style={{
									fontWeight: styles.font.weight.semi_bold,
									fontSize: styles.font.size.lg,
									fontFamily: styles.font.family,
									color:
										key === 'notification_number'
											? styles.theme.colors.fda
											: styles.theme.colors[activeTheme].text
								}}
							>
								{results?.is_invalid && index === 0 ? results?.name : results[key]}
							</Text>
						</Animated.View>
					);
				})}

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

				<Animated.View entering={staggerCardAnimation(results?.is_invalid ? 4 : 7)}>
					<TouchableOpacity
						onPress={onPress}
						activeOpacity={0.7}
						style={{
							borderRadius: styles.border.radius.size.sm,
							alignSelf: 'center',
							marginTop: styles.spacing.lg,
							backgroundColor: styles.theme.colors.fda,
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
							{buttonText ? buttonText : 'check another product'}
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</Animated.ScrollView>
		</>
	);
}
