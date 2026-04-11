import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Flask = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M5 21q-1.275 0-1.812-1.137t.262-2.113L9 11V5H8a.97.97 0 0 1-.712-.287A.97.97 0 0 1 7 4q0-.424.288-.712A.97.97 0 0 1 8 3h8q.425 0 .713.288Q17 3.575 17 4q0 .424-.287.713A.97.97 0 0 1 16 5h-1v6l5.55 6.75q.8.975.263 2.113Q20.275 21 19 21zm2-3h10l-3.4-4h-3.2z'
			fill={color}
		/>
	</Svg>
);
export default Flask;
