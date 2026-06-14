import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Warn = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			d='M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75 1.25 17.937 1.25 12 6.063 1.25 12 1.25m0 13.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 7a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1'
			fill={color}
		/>
	</Svg>
);
export default Warn;
