import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ArrowDoubleUp = ({ size = 24, color = 'black' }) => (
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
		<Path d='M18 11.5s-4.419-6-6-6-6 6-6 6m12 7s-4.419-6-6-6-6 6-6 6' />
	</Svg>
);
export default ArrowDoubleUp;
