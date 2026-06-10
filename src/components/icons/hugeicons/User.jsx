import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const User = ({ size = 24, color = 'black' }) => (
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
			d='M12 3.5a5 5 0 0 1 0 10 7 7 0 0 1 7 7H5a7 7 0 0 1 7-7 5 5 0 0 1 0-10'
			fill={color}
		/>
		<Path
			d='M17 8.5a5 5 0 1 0-10 0 5 5 0 0 0 10 0'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M19 20.5a7 7 0 1 0-14 0'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default User;
