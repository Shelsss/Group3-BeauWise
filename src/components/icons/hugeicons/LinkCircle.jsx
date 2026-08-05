import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const LinkCirlcle = ({ size = 24, color = 'black' }) => (
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
	>
		<Path d='M21.002 12A9 9 0 0 1 12 21a9 9 0 1 1 0-18' />
		<Path
			d='M20.554 3.47 14.99 9.01m5.564-5.54c-.495-.496-3.832-.45-4.537-.44m4.537.44c.495.494.449 3.83.439 4.535'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default LinkCirlcle;
