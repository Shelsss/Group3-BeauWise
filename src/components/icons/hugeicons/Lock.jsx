import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Lock = ({ size = 24, color = 'black' }) => (
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
			d='M16.5 9.5v-3a4.5 4.5 0 1 0-9 0v3m2.625 5.5H10m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0Zm3.875 0H14m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0Z'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
	</Svg>
);
export default Lock;
