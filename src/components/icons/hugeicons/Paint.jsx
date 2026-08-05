import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
const Paint = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill={color}
		fillOpacity={0.5}
		stroke={color}
		strokeWidth={1.5}
	>
		<Path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c.842 0 2 .116 2-1 0-.609-.317-1.079-.631-1.546-.46-.683-.917-1.359-.369-2.454.667-1.333 1.778-1.333 3.482-1.333.851 0 1.851 0 3.018-.167 2.101-.3 2.5-1.592 2.5-3.5Z' />
		<Circle cx={9.5} cy={8.5} r={1.5} />
		<Circle cx={16.5} cy={9.5} r={1.5} />
		<Path
			d='M7.125 15H7m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Paint;
