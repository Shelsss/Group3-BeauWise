import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const PasswordChange = ({ size = 24, color = 'red' }) => (
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
		<Path d='M21.5 12A9.5 9.5 0 1 1 12 2.5a9.5 9.5 0 0 1 8.71 5.7m.79-2.7-.475 3.175L18 8' />
		<Path d='M10 11V9.5a2 2 0 1 1 4 0V11' />
		<Path
			d='M11.25 16.5h1.5c1.173 0 1.76 0 2.163-.31a1.5 1.5 0 0 0 .277-.277c.31-.404.31-.99.31-2.163s0-1.76-.31-2.163a1.5 1.5 0 0 0-.277-.277c-.404-.31-.99-.31-2.163-.31h-1.5c-1.173 0-1.76 0-2.163.31a1.5 1.5 0 0 0-.277.277c-.31.404-.31.99-.31 2.163s0 1.76.31 2.163a1.5 1.5 0 0 0 .277.277c.404.31.99.31 2.163.31'
			fill={color}
			fillOpacity={0.5}
		/>
	</Svg>
);
export default PasswordChange;
