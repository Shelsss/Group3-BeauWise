import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Lock2 = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path opacity={0.4} d='M5 15a7 7 0 1 1 14 0 7 7 0 0 1-14 0' fill={color} />
		<Path d='M5 15a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z' stroke={color} strokeWidth={1.5} />
		<Path
			d='M12 16v-2'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M16.5 9.5v-3a4.5 4.5 0 1 0-9 0v3'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
	</Svg>
);
export default Lock2;
