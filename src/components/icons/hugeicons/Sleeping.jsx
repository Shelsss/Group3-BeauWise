import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
const Sleeping = ({ size = 24, color = 'black' }) => (
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
		<Path d='M13 2.05Q12.507 2 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10q-.002-1.03-.2-2' />
		<Path d='M10 11H8.707c-.453 0-.887-.18-1.207-.5m6.5.5h1.293c.453 0 .887-.18 1.207-.5' />
		<Circle cx={12} cy={16} r={2} />
		<Path d='M17 2h2.947c.62 0 .93 0 1.013.2s-.128.44-.55.92l-2.425 2.76c-.422.48-.633.72-.55.92s.392.2 1.012.2H21' />
	</Svg>
);
export default Sleeping;
