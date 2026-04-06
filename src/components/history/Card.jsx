/* eslint-disable react-native/no-unused-styles */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CircleCheckBig, CircleAlert, TriangleAlert } from 'lucide-react-native';
import { createAnimatedComponent, FadeIn } from 'react-native-reanimated';
import Archive from '@/components/icons/ArchiveFill';
import ShieldCheck from '@/components/icons/ShieldCheckFill';
import Colors from '@/constants/Colors';
import Camera from '@/components/icons/CameraFill';
const AnimatedPressable = createAnimatedComponent(Pressable);
const ICON_SIZE = 20;

export default function Card({ title, time, status, type = 'default' }) {
	return (
		<AnimatedPressable
			entering={FadeIn}
			android_ripple={{ color: '#9797976a', foreground: true }}
			style={[
				{
					backgroundColor: '#fff',
					padding: 15,
					borderRadius: 10,
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
						backgroundColor: '#00ACC11a',
						padding: 15,
						borderRadius: 100
					}}
				>
					<Archive size={20} color='#00ACC1' />
				</View>
			) : type === 'fda' ? (
				<View
					style={{
						backgroundColor: '#20C9971a',
						padding: 15,
						borderRadius: 100
					}}
				>
					<ShieldCheck size={20} color='#20C997' />
				</View>
			) : (
				<View
					style={{
						backgroundColor: Colors.primary + '1a',
						padding: 15,
						borderRadius: 100
					}}
				>
					<Camera size={20} color={Colors.primary} />
				</View>
			)}
			<View>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={{
						fontWeight: 'bold',
						fontSize: 16,
						width: 150,
						color: Colors.textColor
					}}
				>
					{title}
				</Text>
				<Text style={{ fontSize: 12, color: '#666' }}>{time}</Text>
			</View>
			<View style={{ marginLeft: 'auto' }}>
				<View
					style={[
						{
							padding: 10,
							borderRadius: 100
						},
						STYLES[status]
					]}
				>
					{status === 'safe' ? (
						<CircleCheckBig size={ICON_SIZE} color={'#20c997'} />
					) : status === 'unsafe' ? (
						<TriangleAlert size={ICON_SIZE} color={'#ff7a7c'} />
					) : (
						<CircleAlert size={ICON_SIZE} color={'#ffc53d'} />
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
	}
});
