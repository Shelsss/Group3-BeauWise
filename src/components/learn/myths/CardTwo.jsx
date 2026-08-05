import DocumentIcon from '@/components/icons/hugeicons/Document';
import Notepad from '@/components/icons/hugeicons/Notepad';
import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function Card({ title, numberOfTopics, onPress, id }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.9}
			style={{
				overflow: 'hidden',
				borderWidth: 1,
				borderColor: styles.theme.colors[activeTheme].card_border,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderRadius: styles.border.radius.size.sm,
				alignItems: 'center',
				paddingTop: 0,
				height: 220
			}}
		>
			<View style={{ flexGrow: 1, overflow: 'hidden' }}>
				{/* https://cdn.beauwise.tech/learn/${id}/display_image.webp */}
				<Image
					source={``}
					contentFit='cover'
					transition={{
						duration: 200,
						effect: 'cross-dissolve'
					}}
					recyclingKey={id}
					cachePolicy='memory-disk'
					style={{
						width: 180,
						aspectRatio: 16 / 9
					}}
				/>
			</View>

			<View
				style={{
					alignSelf: 'flex-start',
					flex: 1,
					position: 'absolute',
					left: 8,
					bottom: 60
				}}
			>
				<Text
					style={{
						paddingRight: 50,
						fontWeight: styles.font.weight.bold,
						fontSize: styles.font.size.sm,
						fontFamily: styles.font.family,

						color: styles.theme.colors[activeTheme].text
					}}
				>
					{title}
				</Text>
			</View>

			<View
				style={{
					alignSelf: 'flex-start',
					flex: 1,
					position: 'absolute',
					left: 8,
					bottom: 8
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: styles.spacing.sm
					}}
				>
					<Notepad
						size={styles.icon.size.xl}
						color={styles.theme.colors[activeTheme].icon + '9a'}
					/>

					<Text
						style={{
							paddingRight: 50,
							fontSize: styles.font.size.sm,
							fontFamily: styles.font.family,
							color: styles.theme.colors[activeTheme].text + '9a'
						}}
					>
						{numberOfTopics} topics
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
