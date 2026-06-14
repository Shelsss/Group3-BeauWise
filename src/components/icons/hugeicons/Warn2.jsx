import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Warn2 = ({ size = 24, color = 'black' }) => (
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
		<Path
			fillOpacity={0.4}
			d='M13.925 21h-3.85c-4.63 0-6.945 0-7.799-1.506-.853-1.506.331-3.503 2.7-7.495L6.9 8.753C9.176 4.918 10.313 3 12 3s2.824 1.918 5.1 5.753L19.023 12c2.369 3.992 3.553 5.989 2.7 7.495C20.87 21 18.555 21 13.924 21'
			fill={color}
		/>
		<Path
			d='M12 17v-4m0-3.75h.125m.125 0a.25.25 0 1 0-.5 0 .25.25 0 0 0 .5 0'
			stroke='currentColor'
		/>
	</Svg>
);
export default Warn2;
