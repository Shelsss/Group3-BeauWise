import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const InputNumeric = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			d='M16 6H8c-2.828 0-4.243 0-5.121.879C2 7.757 2 9.172 2 12s0 4.243.879 5.121C3.757 18 5.172 18 8 18h8c2.828 0 4.243 0 5.121-.879C22 16.243 22 14.828 22 12s0-4.243-.879-5.121C20.243 6 18.828 6 16 6'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			opacity={0.4}
			d='M6 9h1v6m-1 0h2m3-6h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default InputNumeric;
