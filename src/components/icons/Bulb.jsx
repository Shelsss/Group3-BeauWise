import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Bulb = ({ color = 'black', size = 24 }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M10 18q-.825 0-1.412-.587A1.93 1.93 0 0 1 8 16v-1.25a6.7 6.7 0 0 1-2.213-2.5A7 7 0 0 1 5 9q0-2.925 2.037-4.962T12 2t4.962 2.037T19 9a6.9 6.9 0 0 1-.788 3.238A6.96 6.96 0 0 1 16 14.75V16q0 .824-.588 1.413A1.93 1.93 0 0 1 14 18zm0 4a.97.97 0 0 1-.713-.288A.97.97 0 0 1 9 21v-1h6v1q0 .424-.287.712A.97.97 0 0 1 14 22z'
			fill={color}
		/>
	</Svg>
);
export default Bulb;
