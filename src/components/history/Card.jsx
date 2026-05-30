/* eslint-disable react-native/no-unused-styles */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
	CircleCheckBig,
	CircleAlert,
	TriangleAlert,
	ChevronRight
} from 'lucide-react-native';
import { createAnimatedComponent, FadeIn } from 'react-native-reanimated';
import Archive from '@/components/icons/ArchiveFill';
import Colors from '@/constants/Colors';
import Camera from '@/components/icons/hugeicons/Camera';
import InputNumeric from '@/components/icons/hugeicons/InputNumeric';
import ShieldCheck from '@/components/icons/hugeicons/ShieldCheck';
import Alert from '../icons/hugeicons/Alert';
import Warn from '../icons/hugeicons/Warn';
import Check from '../icons/hugeicons/Check';
const AnimatedPressable = createAnimatedComponent(Pressable);
const ICON_SIZE = 16;

export default function Card({
	title,
	time,
	status = 'default',
	type = 'default',
	onPress
}) {
	return (
		<AnimatedPressable
			onPress={onPress}
			entering={FadeIn}
			android_ripple={{ color: '#9797976a', foreground: true }}
			style={[
				{
					backgroundColor: '#fff',
					padding: 12,
					borderRadius: 16,
					flexDirection: 'row',
					alignItems: 'center',
					columnGap: 10,
					overflow: 'hidden'
				}
			]}
		>
			{type === 'batch' ? (
				<View
					style={{
						marginHorizontal: 8,
						borderRadius: 12
					}}
				>
					<InputNumeric size={22} color='#00ACC1' />
				</View>
			) : type === 'arrow' ? (
				<View
					style={{
						backgroundColor: '#20C9971a',
						borderRadius: 12,
						marginHorizontal: 8
					}}
				>
					<ChevronRight size={22} color={Colors.textColor} />
				</View>
			) : type === 'fda' ? (
				<View
					style={{
						marginHorizontal: 8,
						backgroundColor: '#20C9971a',

						borderRadius: 12
					}}
				>
					<ShieldCheck size={22} color='#20C997' />
				</View>
			) : (
				<View style={{ marginHorizontal: 8, borderRadius: 12 }}>
					<Camera size={22} color={Colors.primary} />
				</View>
			)}
			<View>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={{
						fontFamily: 'Outfit',
						fontWeight: 700,
						fontSize: 14,
						width: 150,
						color: Colors.textColor
					}}
				>
					{title}
				</Text>
				<Text style={{ fontFamily: 'Outfit', fontSize: 12, color: '#666' }}>{time}</Text>
			</View>
			<View style={{ marginLeft: 'auto' }}>
				<View
					style={[
						{
							padding: 8,
							borderRadius: 10
						}
					]}
				>
					{status === 'safe' ? (
						<Check size={ICON_SIZE} color={'#20c997'} />
					) : status === 'unsafe' ? (
						<Alert size={ICON_SIZE} color={'#ff7a7c'} />
					) : status === 'warn' ? (
						<Warn size={ICON_SIZE} color={'#ffc53d'} />
					) : (
						<ChevronRight size={ICON_SIZE} color={'#334155ad'} />
					)}
				</View>
			</View>
		</AnimatedPressable>
	);
}

const STYLES = StyleSheet.create({
	safe: {
		backgroundColor: '#20c9971a'
	},

	unsafe: {
		backgroundColor: '#ff7a7c1a'
	},

	warn: {
		backgroundColor: '#ffc53d1a'
	},

	default: {
		backgroundColor: 'none'
	}
});
