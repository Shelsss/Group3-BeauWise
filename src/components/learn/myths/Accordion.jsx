import CircleCheckFill from '@/components/icons/CircleCheckFill';
import Colors from '@/constants/Colors';
import { ChevronDown } from 'lucide-react-native';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, {
	createAnimatedComponent,
	Easing,
	ReduceMotion,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';

const AnimatedChevronDown = createAnimatedComponent(ChevronDown);

export default function Accordion({ children, viewKey, hiddenContent, duration = 550 }) {
	const isExpanded = useSharedValue(false);
	const height = useSharedValue(0);

	const derivedHeight = useDerivedValue(() =>
		withTiming(height.value * Number(isExpanded.value), {
			duration
		})
	);

	const bodyStyle = useAnimatedStyle(() => ({
		height: derivedHeight.value
	}));

	const chevronStyle = useAnimatedStyle(() => {
		const activeStyle = withTiming(`${180}deg`, {
			duration: 350,
			easing: Easing.ease,
			reduceMotion: ReduceMotion.System
		});

		const defaultStyle = withTiming(`${0}deg`, {
			duration: 350,
			easing: Easing.ease,
			reduceMotion: ReduceMotion.System
		});

		return {
			transform: [
				{
					rotate: isExpanded.value ? activeStyle : defaultStyle
				}
			]
		};
	});

	const handleVisibility = () => {
		isExpanded.value = !isExpanded.value;
	};

	return (
		<View
			style={{
				backgroundColor: '#ff7a7c3a',
				borderTopStartRadius: 16,
				borderTopEndRadius: 16,
				borderBottomStartRadius: !isExpanded.value ? 16 : 0,
				borderBottomEndRadius: !isExpanded.value ? 16 : 0
			}}
		>
			<Pressable
				onPress={handleVisibility}
				style={{
					alignItems: 'center',
					flexDirection: 'row'
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>{children}</View>

				<AnimatedChevronDown
					color={Colors.textColor}
					style={[chevronStyle, { marginLeft: 'auto', marginRight: 20 }]}
					size={18}
				/>
			</Pressable>

			<Animated.View
				key={`accordionItem_${viewKey}`}
				style={[styles.animatedView, bodyStyle]}
			>
				<View
					onLayout={(e) => {
						height.value = e.nativeEvent.layout.height;
					}}
					style={[
						styles.wrapper,
						{ backgroundColor: Colors.backgroundColor, padding: 20 }
					]}
				>
					<CircleCheckFill size={12} color={'#20C997'} />
					<View>
						<Text
							style={{
								fontFamily: 'Outfit',
								textTransform: 'uppercase',
								fontSize: 10,
								fontWeight: 900,
								color: '#20C997'
							}}
						>
							fact
						</Text>
						<Text style={{ fontFamily: 'Outfit', lineHeight: 30, width: 270 }}>
							{hiddenContent}
						</Text>
					</View>
				</View>
			</Animated.View>
		</View>
	);
}
const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		position: 'absolute',
		columnGap: 8,
		flexDirection: 'row'
	},
	animatedView: {
		borderBottomStartRadius: 16,
		borderBottomEndRadius: 16,
		width: '100%',
		overflow: 'hidden'
	}
});
