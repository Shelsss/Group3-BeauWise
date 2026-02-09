import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInRight, FadeOut } from 'react-native-reanimated';
import Colors from '../constants/Colors';

export default function MultiCheckBoxContainer({ options, choiceLabel }) {
	const [active, setActive] = useState([]);

	const handlePress = (id) => () => {
		setActive((prev) => {
			if (prev.includes(id)) {
				return prev.filter((item) => item !== id);
			} else {
				return [...prev, id];
			}
		});
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
				{options?.map((item, index) => {
					return (
						<Pressable onPress={handlePress(item.id)} key={item.id}>
							<Animated.View
								entering={FadeInRight.delay(index * 100)}
								exiting={FadeOut}
								style={{
									backgroundColor: active.includes(item.id) ? '#a78bfa49' : '#f8f4f4',
									borderColor: active.includes(item.id) ? Colors.primary : '#d0d0d0',
									padding: 12,
									borderRadius: 20,
									borderWidth: 1,
									transitionDuration: 200
								}}
							>
								<Animated.Text
									style={{
										color: active.includes(item.id) ? Colors.primary : '#676767',
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
											color: active.includes(item.id) ? Colors.primary : '#9f9f9f',
											fontSize: 10,

											transitionDuration: 200
										}}
									>
										{item?.description}
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
