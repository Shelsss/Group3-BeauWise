import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
const FooImage = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
	>
		<Circle cx={7.5} cy={7.5} r={1.5} strokeLinecap='round' strokeLinejoin='round' />
		<Path d='M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z' />
		<Path d='M5 21c4.372-5.225 9.274-12.116 16.498-7.458' />
	</Svg>
);
export default FooImage;
