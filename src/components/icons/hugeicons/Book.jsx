import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Book = ({ size = 24, color = 'black' }) => (
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
		<Path d='m8 14 3.3-7.542a.764.764 0 0 1 1.4 0L16 14m-6.5-3h5M20 22H6a2 2 0 0 1-2-2' />
		<Path
			fill={color}
			fillOpacity={0.3}
			d='M4 20a2 2 0 0 1 2-2h14V6c0-1.886 0-2.828-.586-3.414S17.886 2 16 2h-6c-2.828 0-4.243 0-5.121.879C4 3.757 4 5.172 4 8z'
		/>
		<Path d='M19.5 18s-1 .763-1 2 1 2 1 2' />
	</Svg>
);
export default Book;
