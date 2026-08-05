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
		field: 'total_aligned_ingredients',
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
		field: 'total_restricted_ingredients',
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

	const { data, refetch, isError, isRefetchError, isLoading } = useQuery({
		queryKey: ['metrics'],
		queryFn: fetchData,
		enabled: isAuthenticated
	});

	const formatData = () => {
		return dashboardSchema.map((item, index) => ({
			...item,
			count: data[item.field] ?? 0
		}));
	};

	return isError || isRefetchError ? (
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
			<Warn color={styles.theme.colors[activeTheme].icon} size={styles.icon.size.xl} />
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
				<Ccw size={styles.icon.size.lg} color={styles.theme.colors[activeTheme].icon} />
			</TouchableOpacity>
		</View>
	) : isLoading ? (
		<View>
			<Skeleton height={138} width={'100%'} borderRadius={styles.border.radius.size.md} />
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
				return (
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
	);
}
