import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ArrowRight = ({ size = 24, color = 'black' }) => (
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
		<Path d='M18.5 12H5m8 6s6-4.419 6-6-6-6-6-6' />
	</Svg>
);
export default ArrowRight;
