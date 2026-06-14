import CircleCheckFill from '@/components/icons/CircleCheckFill';
import Colors from '@/constants/Colors';
import { FlaskConical, Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Disclaimer from '@/components/learn/ingredients-glossary/Disclaimer';

export default function PageLayout({ item }) {
	return (
		<>
			<View
				style={{
					padding: 20,
					backgroundColor: Colors.primary + '1a',
					borderRadius: 100
				}}
			>
				<FlaskConical color={Colors.primary} />
			</View>

			<View
				style={{
					marginTop: 16
				}}
			>
				<View>
					<Text
						style={{
							fontFamily: 'Outfit',
							textAlign: 'center',
							fontSize: 30,
							fontWeight: 600,
							color: Colors.textColor
						}}
					>
						{item.ingredient_name?.replace(/\s*[/(\[].*/, '').trim()}
					</Text>

					<Text
						style={{
							fontFamily: 'Outfit',
							textAlign: 'center',
							fontSize: 16,
							fontWeight: 600,
							color: Colors.textColor + '7a'
						}}
					>
						{item.ingredient_name}
					</Text>
				</View>

				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flexWrap: 'wrap',
						marginTop: 20,
						flexDirection: 'row',
						gap: 10
					}}
				>
					{item.category?.map((item) => (
						<Text key={item} style={STYLES.category}>
							{item}
						</Text>
					))}
				</View>
			</View>

			<View style={{ width: '100%', rowGap: 20, marginTop: 20 }}>
				{item.warning && (
					<Disclaimer
						content={item.warning}
						color={'#ff7a7c'}
						disclaimerTitle={'Warning'}
					>
						<Info size={18} color={'#ff7a7c'} />
					</Disclaimer>
				)}

				<View
					style={{
						backgroundColor: Colors.backgroundColor,
						padding: 16,
						borderRadius: 24,
						rowGap: 8
					}}
				>
					<Text
						style={{
							fontFamily: 'Outfit',
							fontSize: 18,
							fontWeight: 700,
							color: Colors.textColor
						}}
					>
						What It Is
					</Text>
					<Text style={{ fontFamily: 'Outfit', lineHeight: 25, color: Colors.textColor }}>
						{item.what_it_is}
					</Text>
				</View>

				{item.what_it_does && (
					<View
						style={{
							backgroundColor: Colors.backgroundColor,
							padding: 16,
							borderRadius: 24,
							rowGap: 8
						}}
					>
						<Text
							style={{
								fontFamily: 'Outfit',
								fontSize: 18,
								fontWeight: 700,
								color: Colors.textColor
							}}
						>
							What It Does
						</Text>
						<View style={{ rowGap: 12 }}>
							{item.what_it_does?.map((item) => (
								<View
									key={item}
									style={{ flexDirection: 'row', width: 250, columnGap: 8 }}
								>
									<View style={{ marginTop: 4 }}>
										<CircleCheckFill size={18} color={'#20C997'} />
									</View>

									<Text
										style={{
											fontFamily: 'Outfit',
											lineHeight: 20,
											color: Colors.textColor
										}}
									>
										{item}
									</Text>
								</View>
							))}
						</View>
					</View>
				)}

				<View
					style={{
						backgroundColor: Colors.backgroundColor,
						padding: 16,
						borderRadius: 24,
						rowGap: 8
					}}
				>
					<Text
						style={{
							fontFamily: 'Outfit',
							fontSize: 18,
							fontWeight: 700,
							color: Colors.textColor
						}}
					>
						Usage
					</Text>

					<View style={{ rowGap: 16 }}>
						{item.best_for && (
							<View>
								<Text
									style={{
										fontFamily: 'Outfit',
										textTransform: 'uppercase',
										fontSize: 12,
										color: '#20C997'
									}}
								>
									best for
								</Text>

								<Text
									style={{
										fontFamily: 'Outfit',
										lineHeight: 25,
										color: Colors.textColor
									}}
								>
									{item.best_for}
								</Text>
							</View>
						)}

						{item.common_products && (
							<View>
								<Text
									style={{
										fontFamily: 'Outfit',
										textTransform: 'uppercase',
										fontSize: 12,
										color: '#20C997'
									}}
								>
									best for
								</Text>

								<Text
									style={{
										fontFamily: 'Outfit',
										lineHeight: 25,
										color: Colors.textColor
									}}
								>
									{item.common_products}
								</Text>
							</View>
						)}
					</View>
				</View>

				{item.safety_level && (
					<Disclaimer
						content={item.safety_level}
						color={'#20C997'}
						disclaimerTitle={'Safety Level'}
					>
						<CircleCheckFill size={18} color={'#20C997'} />
					</Disclaimer>
				)}
			</View>
		</>
	);
}

const STYLES = StyleSheet.create({
	category: {
		fontFamily: 'Outfit',
		borderRadius: 100,
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 600,
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: Colors.primary + '1a',
		color: Colors.primary,
		textTransform: 'uppercase'
	}
});
