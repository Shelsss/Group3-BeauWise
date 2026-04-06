import * as React from 'react';
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';
const Archive = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 24 24'
		className='lucide lucide-archive-icon lucide-archive'
	>
		<Defs>
			<Mask id='a'>
				<Path fill='#fff' d='M0 0h24v24H0z' />
				<Path
					d='M10 12h4'
					stroke='#000'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</Mask>
		</Defs>
		<Rect
			x={2}
			y={3}
			width={20}
			height={5}
			strokeWidth={2}
			rx={1}
			stroke={color}
			fill='transparent'
		/>
		<Path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z' fill={color} mask='url(#a)' />
	</Svg>
);
export default Archive;
