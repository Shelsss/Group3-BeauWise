import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Spark = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 18 18'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='m8.96 0 2.56 6.4 6.4 2.56-6.4 2.56-2.56 6.4-2.56-6.4L0 8.96 6.4 6.4z'
			fill={color}
		/>
	</Svg>
);
export default Spark;
