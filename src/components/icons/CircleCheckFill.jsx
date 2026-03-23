import * as React from 'react';
import Svg, { Defs, Mask, Path, Circle } from 'react-native-svg';
const CircleCheckFill = ({ size, color }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 24 24'
		className='lucide lucide-circle-check-icon lucide-circle-check'
	>
		<Defs>
			<Mask id='a'>
				<Path fill='#fff' d='M0 0h24v24H0z' />
				<Path
					d='m9 12 2 2 4-4'
					stroke='#000'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					fill='none'
				/>
			</Mask>
		</Defs>
		<Circle fill={color} cx={12} cy={12} r={10} mask='url(#a)' />
	</Svg>
);
export default CircleCheckFill;
