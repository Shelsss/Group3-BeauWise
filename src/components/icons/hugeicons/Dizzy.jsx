import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
const Dizzy = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
	>
		<Circle cx={12} cy={12} r={10} fill='currentColor' fillOpacity={0.4} />
		<Path
			d='M12 22.75c5.937 0 10.75-4.813 10.75-10.75S17.937 1.25 12 1.25 1.25 6.063 1.25 12 6.063 22.75 12 22.75m0-1.5a9.25 9.25 0 1 1 0-18.5 9.25 9.25 0 0 1 0 18.5m-2.53-9.72a.75.75 0 0 0 1.06-1.06l-.97-.97.97-.97a.75.75 0 0 0-1.06-1.06l-.97.97-.97-.97a.75.75 0 1 0-1.06 1.06l.97.97-.97.97a.75.75 0 1 0 1.06 1.06l.97-.97zm7 0a.75.75 0 0 0 1.06-1.06l-.97-.97.97-.97a.75.75 0 0 0-1.06-1.06l-.97.97-.97-.97a.75.75 0 1 0-1.06 1.06l.97.97-.97.97a.75.75 0 1 0 1.06 1.06l.97-.97zm-1.07 5.92a.75.75 0 1 0 1.2-.9 5.74 5.74 0 0 0-4.6-2.3 5.74 5.74 0 0 0-4.6 2.3.75.75 0 1 0 1.2.9 4.24 4.24 0 0 1 3.4-1.7 4.24 4.24 0 0 1 3.4 1.7'
			fill='currentColor'
		/>
	</Svg>
);
export default Dizzy;
