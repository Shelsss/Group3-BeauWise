import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const TestTube = ({ size = 24, color = 'black' }) => (
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
			d='M16 18V8.615c-.444 1.035-1.778 2.129-4 .703-1.69-1.083-3.111-1.915-4-.762V18a4 4 0 0 0 8 0'
			fill={color}
		/>
		<Path d='M16 2v16a4 4 0 1 1-8 0V2' stroke={color} strokeWidth={1.5} />
		<Path
			d='M8 8.557c.889-1.154 2.31-.322 4 .761 2.222 1.426 3.556.332 4-.703'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
		<Path
			d='M7 2h10m-3.875 12H13m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0m-2.125 4H11m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default TestTube;
