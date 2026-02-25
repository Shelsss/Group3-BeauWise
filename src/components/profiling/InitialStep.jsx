import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Wand, Heart } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InitialStep() {
	const { top } = useSafeAreaInsets();
	return (
		<>
			<Animated.View
				entering={FadeInUp.delay(100).duration(300)}
				style={{ display: 'flex', alignItems: 'center', marginTop: top + 50 }}
			>
				<LinearGradient
					start={{ x: 0.3, y: 0.7 }}
					end={{ x: 1, y: 0.2 }}
					colors={['#b8a4f5', '#ffb9ca']}
					style={{
						padding: 30,
						borderRadius: 100,

						shadowColor: '#0000004f',
						shadowOffset: {
							width: 0,
							height: 18
						},
						shadowOpacity: 0.25,
						shadowRadius: 20.0,
						elevation: 24
					}}
				>
					<Sparkles fill={'#ffffff'} color={'#ffffff'} size={30} />
				</LinearGradient>
			</Animated.View>

			<Animated.View
				entering={FadeInUp.delay(200).duration(300)}
				style={{ display: 'flex', alignItems: 'center', rowGap: 14, marginTop: top + 30 }}
			>
				<Text style={{ fontWeight: '800', fontSize: 24, color: '#1F2937' }}>
					Let's Get to Know You!
				</Text>
				<Text
					style={{
						textAlign: 'center',
						width: '80%',
						color: '#6B7280',
						lineHeight: 25
					}}
				>
					Help us personalize your beauty journey by answering a few questions about your
					skin and hair.
				</Text>
			</Animated.View>

			<Animated.View
				entering={FadeInUp.delay(300).duration(300)}
				style={{
					display: 'flex',
					backgroundColor: '#e7e7ff',
					borderWidth: 1,
					borderColor: '#d3d3ffae',
					borderRadius: 18,
					padding: 18,

					rowGap: 22,
					marginLeft: 20,
					marginRight: 20,
					marginTop: 30,
					marginBottom: 'auto'
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: 8
					}}
				>
					<View
						style={{
							backgroundColor: '#e1e1f7',
							padding: 8,
							borderRadius: 100,
							borderWidth: 0.5,
							borderColor: '#c8c6e887'
						}}
					>
						<Wand color={Colors.primary} size={18} />
					</View>

					<View style={{ display: 'flex', rowGap: 4 }}>
						<Text style={{ fontWeight: '800', color: '#1F2937' }}>
							Personal Recommendations
						</Text>
						<Text style={{ color: '#6B7280', width: '80%', fontSize: 12 }}>
							Get ingredient analysis tailored to your unique profile.
						</Text>
					</View>
				</View>

				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: 8
					}}
				>
					<View
						style={{
							backgroundColor: '#e1e1f7',
							padding: 8,
							borderRadius: 100,
							borderWidth: 0.5,
							borderColor: '#c8c6e887'
						}}
					>
						<Heart color={Colors.primary} size={18} />
					</View>

					<View style={{ display: 'flex', rowGap: 4 }}>
						<Text style={{ fontWeight: '800', color: '#1F2937' }}>Skip Anytime</Text>
						<Text style={{ color: '#6B7280', width: '80%', fontSize: 12 }}>
							You can skip individual questions or the entire sections.
						</Text>
					</View>
				</View>
			</Animated.View>
		</>
	);
}
