import Notepad from '@/components/icons/hugeicons/Notepad';
import styles from '@/config/styles';
import { useBackHandler } from '@react-native-community/hooks';
import {
	Text,
	TouchableOpacity,
	useColorScheme,
	useWindowDimensions,
	View
} from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import Card from '@/components/learn/myths/CardThree';
import { LegendList } from '@legendapp/list';
import { Image, useImage } from 'expo-image';
import { useThemeStore } from '@/stores/useThemeStore';
import { ChevronRight, X } from 'lucide-react-native';
import Document from '@/components/icons/hugeicons/Document';
import LinkCircle from '@/components/icons/hugeicons/LinkCircle';
import { openBrowserAsync } from 'expo-web-browser';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	useBottomSheetModal,
	useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { ResumableZoom } from 'react-native-zoom-toolkit';
import { useVideoPlayer, VideoView } from 'expo-video';
import Skeleton from '@/components/Skeleton';
const data = [
	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'red'
	},

	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'blue'
	},
	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'green'
	},

	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'yellow'
	},
	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'purple'
	},

	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'brown'
	},
	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'orange'
	},

	{
		title: 'Pore Myths & Facts',
		myth: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		fact: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
		background: 'violet'
	}
];

export default function MythFactDetail({ selectedItem, onBack }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

	const { dismiss } = useBottomSheetModal();

	const data = ['initial', ...selectedItem.topics];
	const parentId = selectedItem.id;
	const parentName = selectedItem.name;
	const parentDescription = selectedItem?.description;
	const numberOfTopics = selectedItem.topics.length;
	const cacheImageTag = selectedItem.displayImage?.fileHash;
	const cacheVideoTag = selectedItem.videoGuide?.fileHash;
	const sources = [...selectedItem.sources, 'video'];

	const sheetRef = useRef(null);

	const player = useVideoPlayer(
		`https://cdn.beauwise.tech/learn/${selectedItem.baseImagePath}/video_guide.mp4?q=${cacheVideoTag}`,
		(player) => {
			player.loop = true;
		}
	);

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

	const animationConfigs = useBottomSheetSpringConfigs({
		damping: 120,
		stiffness: 920
	});

	useBackHandler(() => {
		if (dismiss()) {
			return true;
		}

		onBack();
		return true;
	}, []);

	return (
		<Animated.View
			entering={FadeIn.delay(500)}
			style={{
				flex: 1,
				zIndex: 1
			}}
		>
			<LegendList
				overScrollMode='never'
				showsVerticalScrollIndicator={false}
				pagingEnabled={true}
				keyExtractor={(item, index) => `${item.title}-${index}`}
				data={data}
				centerContent={true}
				snapToInterval={SCREEN_HEIGHT}
				decelerationRate={0.985}
				disableIntervalMomentum={true}
				contentContainerStyle={{ paddingBottom: 0 }}
				ListFooterComponent={() => (
					<View
						style={{
							width: SCREEN_WIDTH,
							height: SCREEN_HEIGHT,
							alignItems: 'center',
							justifyContent: 'center',
							rowGap: styles.spacing.xxl
						}}
					>
						<Text
							style={{
								color: styles.theme.colors[activeTheme].text,
								fontFamily: styles.font.family
							}}
						>
							{selectedItem.name} Video Overview
						</Text>

						<VideoView
							player={player}
							allowsPictureInPicture={true}
							style={{
								aspectRatio: 16 / 9,
								width: 300,
								borderWidth: 1,
								borderRadius: styles.border.radius.size.sm,
								borderColor: styles.theme.colors[activeTheme].card_border
							}}
						/>
					</View>
				)}
				renderItem={({ item, index }) => {
					return (
						<>
							<View
								style={{
									paddingTop: '40%',
									width: SCREEN_WIDTH,
									height: index === data.length - 1 ? SCREEN_HEIGHT - 40 : SCREEN_HEIGHT
								}}
							>
								<View
									style={{
										marginHorizontal: styles.spacing.double_xl
									}}
								>
									{index === 0 ? (
										<Initial
											baseImagePath={selectedItem.baseImagePath}
											name={parentName}
											id={parentId}
											description={parentDescription}
											cacheImageTag={cacheImageTag}
											numberOfTopics={numberOfTopics}
										/>
									) : (
										<Card
											baseImagePath={selectedItem.baseImagePath}
											title={item.topic}
											myth={item.myth}
											imageId={item.imageId}
											cacheImageTag={item?.fileHash}
											fact={item.fact}
											id={item.id}
											parentId={parentId}
										/>
									)}
								</View>
							</View>

							{index === numberOfTopics && <Source sheetRef={sheetRef} />}
						</>
					);
				}}
			/>

			<BottomSheetModal
				animationConfigs={animationConfigs}
				backdropComponent={renderBackdrop}
				enableDynamicSizing={true}
				ref={sheetRef}
				handleComponent={() => (
					<Animated.View
						entering={FadeInDown.delay(400)}
						style={{
							alignSelf: 'center',
							marginBottom: styles.spacing.xxl,
							backgroundColor: activeTheme === 'light' ? '#fefefe' : '#0f172abb',
							padding: styles.spacing.md,
							borderRadius: styles.border.radius.size.pill
						}}
					>
						<TouchableOpacity
							onPress={() => {
								dismiss();
							}}
						>
							<X
								size={styles.icon.size.xl}
								color={styles.theme.colors[activeTheme].icon}
								strokeWidth={1.5}
							/>
						</TouchableOpacity>
					</Animated.View>
				)}
				enableOverDrag={false}
				backgroundComponent={null}
			>
				<BottomSheetView>
					<View
						style={{
							paddingBottom: styles.spacing.double_xxl,
							backgroundColor: styles.theme.colors[activeTheme].screen_background
						}}
					>
						<Text
							style={{
								paddingVertical: styles.spacing.xxl,
								textAlign: 'center',
								fontFamily: styles.font.family,
								fontSize: styles.font.size.lg,
								fontWeight: styles.font.weight.semi_bold,
								color: styles.theme.colors[activeTheme].text
							}}
						>
							References
						</Text>

						{sources.map(
							(source, index) =>
								typeof source !== 'string' && (
									<TouchableOpacity
										onPress={() => {
											openBrowserAsync(source.link, {
												showInRecents: false,
												toolbarColor: styles.theme.colors.primary,
												controlsColor: styles.theme.colors.primary,
												showTitle: false
											});
										}}
										key={source.name}
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											flexDirection: 'row',
											paddingVertical: styles.spacing.one_xl,
											columnGap: styles.spacing.sm
										}}
									>
										<Text
											style={{
												fontSize: styles.font.size.md,
												textAlign: 'center',
												fontFamily: styles.font.family,
												color: '#3B82F6'
											}}
										>
											{source.name}
										</Text>

										<LinkCircle color='#3B82F6' size={styles.icon.size.lg} />
									</TouchableOpacity>
								)
						)}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</Animated.View>
	);
}

function Source({ sheetRef }) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
		<Animated.View
			style={{
				alignSelf: 'flex-end',
				bottom: 60,
				right: 22,
				backgroundColor: styles.theme.colors[activeTheme].card_background,
				borderWidth: 1,
				borderColor: styles.theme.colors[activeTheme].card_border,
				borderRadius: styles.border.radius.size.pill,

				position: 'absolute',
				rowGap: styles.spacing.lg
			}}
		>
			<TouchableOpacity
				onPress={() => {
					sheetRef.current.present();
				}}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					padding: styles.spacing.xxl,
					columnGap: styles.spacing.sm
				}}
			>
				<Document size={styles.icon.size.xl * 1.2} color='#3B82F6' />
			</TouchableOpacity>
		</Animated.View>
	);
}

function Initial({
	name,
	id,
	description,
	numberOfTopics,
	cacheImageTag,
	baseImagePath
}) {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	const image = useImage(
		`https://${process.env.EXPO_PUBLIC_BEAUWISE_CDN}/learn/${baseImagePath}/display_image.webp?q=${cacheImageTag}`,
		{
			onError: (_, retry) => {
				retry();
			}
		}
	);
	return (
		<View style={{ alignItems: 'center', rowGap: styles.spacing.xl }}>
			<Text
				style={{
					fontWeight: styles.font.weight.semi_bold,
					fontFamily: styles.font.family,
					fontSize: styles.font.size.lg,
					color: styles.theme.colors[activeTheme].text
				}}
			>
				{name}
			</Text>
			<View style={{ aspectRatio: 16 / 9, width: 300 }}>
				<ResumableZoom maxScale={1.6}>
					{!image ? (
						<Skeleton
							width={300}
							height={166}
							style={{ borderRadius: styles.border.radius.size.sm }}
						/>
					) : (
						<Image
							source={image}
							contentFit='contain'
							transition={{
								duration: 200,
								effect: 'cross-dissolve'
							}}
							recyclingKey={id}
							cachePolicy='memory-disk'
							style={{
								zIndex: 2,
								backgroundColor: styles.background_color._04,
								borderWidth: 1,
								borderColor: activeTheme === 'light' ? '#E8E5F2' : 'transparent',
								borderRadius: styles.border.radius.size.sm,
								aspectRatio: 16 / 9,
								width: 300
							}}
						/>
					)}
				</ResumableZoom>
			</View>

			<View
				style={{
					rowGap: styles.spacing.md,
					alignSelf: 'flex-start',
					marginLeft: styles.spacing.double_xl
				}}
			>
				{description && (
					<Text
						style={{
							fontFamily: styles.font.family,
							fontSize: styles.font.size.md,
							color: styles.theme.colors[activeTheme].text
						}}
					>
						{description}
					</Text>
				)}
				<View>
					<View
						style={{
							flexDirection: 'row',
							columnGap: styles.spacing.md,
							alignItems: 'center',
							zIndex: -1
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
							{numberOfTopics} Topics
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

// <Animated.ScrollView
// 	showsVerticalScrollIndicator={false}
// 	layout={LinearTransition.springify().damping(180)}
// 	entering={FadeIn.delay(200)}
// 	exiting={FadeOut.duration(120)}
// 	style={{ zIndex: 2 }}
// 	contentContainerStyle={{
// 		padding: styles.spacing.double_xxl,
// 		rowGap: styles.spacing.double_xxl,
// 		transition: 500
// 	}}
// >
// 	{renderHeader({ activeTheme })}

// 	{data.map(({ title, myth, fact }, index) => {
// 		return <Card key={`${title}-${index}`} title={title} myth={myth} fact={fact} />;
// 	})}
// </Animated.ScrollView>;
