import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const AiUser = ({ size = 24, color = 'black' }) => (
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
			d='m5.5 19.5.56-.98A5 5 0 0 1 10.402 16h3.196a5 5 0 0 1 4.341 2.52l.56.98a10 10 0 0 1-13 0'
			fill={color}
			fillOpacity={0.4}
			stroke='none'
		/>
		<Path d='M15 2.458A10 10 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10a10 10 0 0 0-.458-3' />
		<Path d='M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0' fill={color} fillOpacity={0.4} />
		<Path d='m5.5 19.5.56-.98A5 5 0 0 1 10.402 16h3.196a5 5 0 0 1 4.341 2.52l.56.98m.475-17.479c.006-.028.046-.028.052 0a3.79 3.79 0 0 0 2.953 2.953c.028.006.028.046 0 .052a3.79 3.79 0 0 0-2.953 2.953c-.006.028-.046.028-.052 0a3.79 3.79 0 0 0-2.953-2.953c-.028-.006-.028-.046 0-.052a3.79 3.79 0 0 0 2.953-2.953' />
	</Svg>
);
export default AiUser;
