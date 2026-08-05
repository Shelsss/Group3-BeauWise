import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Ccw = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<Path d='M4 10a8 8 0 1 1 8 8H5' />
		<Path d='M8 14s-4 2.946-4 4 4 4 4 4' />
	</Svg>
);
export default Ccw;
