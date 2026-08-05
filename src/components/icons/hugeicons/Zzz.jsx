import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Zzz = ({ size = 24, color = 'black' }) => (
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
		<Path d='M6 16h4l-4 4h4M4 4h7l-7 8h7m3-3h6l-6 6h6' />
	</Svg>
);
export default Zzz;
