import * as React from 'react';
import Svg, { Defs, Mask, Path } from 'react-native-svg';
const ShieldCheck = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 24 24'
		className='lucide lucide-shield-check-icon lucide-shield-check'
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
		<Path
			d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z'
			fill={color}
			mask='url(#a)'
		/>
	</Svg>
);
export default ShieldCheck;
