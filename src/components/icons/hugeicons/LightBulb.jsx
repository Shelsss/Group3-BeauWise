import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const LightBulb = ({ size = 24, color = 'black' }) => (
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
		<Path
			d='M15.481 16.904c-.001-.17-.002-.255-.001-.279.009-1.037.13-1.33.856-2.072l.581-.575a7 7 0 1 0-9.841 0l.597.592c.713.732.83 1.015.85 2.036l.001.297.001.173A2 2 0 0 0 10.621 19h2.78l.145-.001a2 2 0 0 0 1.935-1.95z'
			fill={color}
			fillOpacity={0.4}
			strokeLinejoin='round'
		/>
		<Path
			d='M9.996 19v1a2 2 0 1 0 4 0v-1m-5.5-3h7'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default LightBulb;
