import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const History = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<Path d='M19 10.5V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2 5.343 2 4.172 3.172 3 6.229 3 10v4.5c0 3.287 0 4.931.908 6.038q.25.304.554.554C5.57 22 7.212 22 10.5 22' />
		<Path strokeOpacity={0.4} d='M7 7h8m-8 4h4' />
		<Path d='m18 18.5-1.5-.55V15.5m-4.5 2a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0' />
	</Svg>
);
export default History;
