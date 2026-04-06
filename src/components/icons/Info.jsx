import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
const Info = ({ size, color }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
		className='lucide lucide-info-icon lucide-info'
	>
		<Circle stroke={color} fill={color} cx={12} cy={12} r={10} />
		<Path color='#fff' d='M12 16v-4m0-4h.01' />
	</Svg>
);
export default Info;
