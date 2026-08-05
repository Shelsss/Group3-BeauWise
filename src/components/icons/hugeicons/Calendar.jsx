import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Calendar = ({ size = 24, color = 'black' }) => (
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
			d='M3 10c0-1.771 0-3.657 1.172-4.828S7.229 4 11 4h2c3.771 0 5.657 0 6.828 1.172S21 8.229 21 10z'
			fill={color}
			fillOpacity={0.3}
			stroke='none'
		/>
		<Path d='M16 2v4M8 2v4m5-2h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172S21 17.771 21 14v-2c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4M3 10h18m-10 4h5m-8 0h.009M13 18H8m8 0h-.009' />
	</Svg>
);
export default Calendar;
