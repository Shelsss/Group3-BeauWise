import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Pattern = ({ size = 24, color = 'black' }) => (
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
			d='M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4m8 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-9 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-16a2 2 0 1 0 0-4 2 2 0 0 0 0 4M4 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4'
			fill={color}
		/>
		<Path
			d='M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4m8 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-9 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-16a2 2 0 1 0 0-4 2 2 0 0 0 0 4M4 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4m10.298-4.127-1.595 4.254m.418-5.443L5.88 7.316m5.872 6.669-.504 4.03m2.541-5.12 4.422 2.21m-.04 1.707-5.343 2.375'
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Pattern;
