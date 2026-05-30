import Colors from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import SingleSidedShadow from './SingleSidedShadow';
import { useAuthStore } from '@/stores/useAuthStore';

export default function CustomHeader({ title, children }) {
	const { top } = useSafeAreaInsets();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const hasRouteHistoryShadow = !isAuthenticated && title === 'History';
	return (
		<SingleSidedShadow hasDefaultStyle={!isAuthenticated || title !== 'History'}>
			<View
				style={[
					{
						backgroundColor: Colors.backgroundColor,
						paddingHorizontal: 15,
						paddingTop: top,
						paddingBottom: 12,
						borderBottomStartRadius: !isAuthenticated || title !== 'History' ? 16 : 0,
						borderBottomEndRadius: !isAuthenticated || title !== 'History' ? 16 : 0
					},
					(!isAuthenticated || title !== 'History') && STYLES.shadow
				]}
			>
				<Animated.Text
					entering={SlideInLeft}
					style={{
						fontFamily: 'Outfit',
						fontSize: 24,
						fontWeight: '700',
						color: title !== 'BeauWise' ? Colors.textColor : Colors.primary
					}}
				>
					{title === 'Home' ? 'BeauWise' : title}
				</Animated.Text>

				{children}
			</View>
		</SingleSidedShadow>
	);
}

const STYLES = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		elevation: 8
	}
});
