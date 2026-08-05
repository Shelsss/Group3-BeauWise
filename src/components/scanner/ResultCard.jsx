import Colors from '@/constants/Colors';
import { Text, View } from 'react-native';
import Flask from '../icons/Flask';
import WarnFill from '../icons/WarnFill';
import { Check } from 'lucide-react-native';
import AlertFill from '../icons/AlertFill';
import Bulb from '../icons/Bulb';
import Question from '../icons/Question';

const iconSize = 20;
export default function ResultCard({ flag, name, description }) {
	return (
		<View
			style={{
				flexDirection: 'row',
				columnGap: 8,
				backgroundColor: Colors.backgroundColor,
				padding: 16,
				borderRadius: 12

				// shadowColor: '#00000048',
				// shadowOffset: {
				// 	width: 0,
				// 	height: 1
				// },
				// shadowOpacity: 0.2,
				// shadowRadius: 1.41,

				// elevation: 2,
				// overflow: 'hidden'
			}}
		>
			<View style={{ marginTop: 4 }}>
				{flag === 'restricted' && <AlertFill size={iconSize} color='#ff8183' />}
				{flag === 'based' && <Flask size={iconSize} color={Colors.primary} />}
				{flag === 'attention' && <WarnFill size={iconSize} color='#ffc53d' />}
				{flag === 'unrecognized' && <Question size={iconSize} color={Colors.textColor} />}
				{flag === 'suggested' && <Bulb size={iconSize} color='#00acc1' />}
				{flag === 'aligned' && (
					<View style={{ padding: 4, borderRadius: 30, backgroundColor: '#20c997' }}>
						<Check size={iconSize - 8} color='#fff' />
					</View>
				)}
			</View>

			<View>
				<Text style={{ fontSize: 14, fontWeight: 700, color: Colors.textColor }}>
					{name}
				</Text>
				<Text
					style={{
						fontSize: 12,
						color: Colors.textColor,
						paddingRight: 20,
						lineHeight: 20
					}}
				>
					{description}
				</Text>
			</View>
		</View>
	);
}
