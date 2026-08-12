import styles from '@/config/styles';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import FdaHistoryView from '@/components/fda/ResultPage';
import BatchHistoryView from '@/components/batch/ResultPage';
import AnalysisHistoryView from '@/components/scanner/Result';

export default function Preview() {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	let { type, data } = useLocalSearchParams();

	data = JSON.parse(data);

	return (
		<>
			<View
				style={{
					flex: 1,
					backgroundColor: styles.theme.colors[activeTheme].screen_background
				}}
			>
				<View
					style={{
						backgroundColor: styles.theme.colors.primary,
						paddingHorizontal: 15,
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
							History
						</Text>

						<Text
							style={{
								textTransform: 'uppercase',
								fontFamily: styles.font.family,
								fontSize: styles.font.size.sm,
								fontWeight: styles.font.weight.light,
								color: styles.font.colors._04
							}}
						>
							{type} Verification Log
						</Text>
					</View>
				</View>
			</View>

			{type === 'batch' && (
				<BatchHistoryView
					buttonText='Back'
					results={{ data }}
					activeTheme={activeTheme}
					onPress={router.back}
				/>
			)}

			{type === 'fda' && (
				<FdaHistoryView
					buttonText='Back'
					results={{ data }}
					activeTheme={activeTheme}
					onPress={router.back}
				/>
			)}

			{type === 'analysis' && (
				<View
					style={{
						position: 'absolute',
						height: '100%',
						marginTop: '35%',
						zIndex: 0,
						width: '100%',
						paddingBottom: styles.spacing.three_xxl * 3.9
					}}
				>
					<AnalysisHistoryView
						isHistoryView={true}
						analyzedIngredients={data?.ingredients}
						product={{ ...data?.product }}
					/>
				</View>
			)}
		</>
	);
}
