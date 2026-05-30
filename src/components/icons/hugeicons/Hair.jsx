import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Hair = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			opacity={0.4}
			d='M10.998 17.996c1.558-1.97-2.65-3.614-1.65-5.668L4.5 15.497c3.346.12 4.992 3.887 6.498 2.5'
			fill={color}
		/>
		<Path
			d='M9.349 12.328c-1 2.054 3.207 3.699 1.649 5.668-1.506 1.388-3.152-2.38-6.498-2.5'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M22 4.439c-5.349-1.602-8.88 1.412-10.93 5.274C8.666 14.243 5.85 15.313 2 16m3 4c2 0 3-2 3-2m2.714-2.706C12.844 12.276 15.286 10 21 10'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M5 20c2 0 3-2 3-2m2.714-2.706C12.844 12.276 15.286 10 21 10'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Hair;
