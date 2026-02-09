import { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import Colors from '../constants/Colors';
import Animated from 'react-native-reanimated';

export default function SingleChoiceQuestion({ options, choiceLabel }) {
	const [active, setActive] = useState(0);

	const handlePress = (id) => () => {
		setActive(id);
	};

	return (
		<View style={{ display: 'flex', rowGap: 8 }}>
			<Text
				style={{
					textTransform: 'uppercase',
					width: '100%',
					fontSize: 14,
					fontWeight: '800'
				}}
			>
				{choiceLabel}
			</Text>

			<View style={{ display: 'flex', rowGap: 12 }}>
				{options?.map((item) => {
					return (
						<Pressable onPress={handlePress(item.id)} key={item.id}>
							<Animated.View
								style={{
									backgroundColor: active === item.id ? '#a78bfa49' : '#f8f4f4',
									borderColor: active === item.id ? Colors.primary : '#d0d0d0',
									padding: 12,
									borderRadius: 20,
									borderWidth: 1,
									transitionDuration: 200
								}}
							>
								<Animated.Text
									style={{
										color: active === item.id ? Colors.primary : '#676767',
										fontSize: 12,
										fontWeight: '700',
										transitionDuration: 200
									}}
								>
									{item.label}
								</Animated.Text>

								{item.description?.length && (
									<Animated.Text
										style={{
											color: active === item.id ? Colors.primary : '#9f9f9f',
											fontSize: 10,
											transitionDuration: 200
										}}
									>
										{item.description}
									</Animated.Text>
								)}
							</Animated.View>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
