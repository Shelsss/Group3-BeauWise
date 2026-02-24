import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Badge = ({ color, size = 24 }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 20 20'
		fill={color}
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M9 8a.5.5 0 0 1 .5-.5H12a.5.5 0 0 1 0 1H9.5A.5.5 0 0 1 9 8m0 3.75a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 1.25a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5'
			fill={color}
		/>
		<Path d='M7.75 9.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0' fill={color} />
		<Path
			d='M8 11.628c0 .63-.672.57-1.5.57s-1.5.06-1.5-.57c0-.631.672-1.428 1.5-1.428s1.5.797 1.5 1.428'
			fill={color}
		/>
		<Path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M1 6.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1z'
			fill={color}
		/>
	</Svg>
);
export default Badge;
