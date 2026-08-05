import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CalendarClock = ({ size = 24, color = 'black' }) => (
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
		<Path
			d='M2.5 10c0-1.771 0-3.657 1.172-4.828S6.729 4 10.5 4h2c3.771 0 5.657 0 6.828 1.172.654.653.943 1.528 1.07 2.828v2Z'
			fill={color}
			fillOpacity={0.3}
			stroke='none'
		/>
		<Path d='M15.5 2v4m-8-4v4m12.899 2c-.128-1.3-.417-2.175-1.07-2.828C18.156 4 16.27 4 12.5 4h-2C6.729 4 4.843 4 3.672 5.172S2.5 8.229 2.5 12v2c0 3.771 0 5.657 1.172 6.828.808.809 1.956 1.06 3.828 1.137M2.5 10h5' />
		<Path d='M15.5 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12' />
		<Path d='M15.5 13v3l2 1' />
	</Svg>
);
export default CalendarClock;
