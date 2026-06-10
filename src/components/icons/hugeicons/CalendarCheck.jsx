import * as React from 'react';
import Svg, { Defs, ClipPath, Path } from 'react-native-svg';
const CalendarCheck = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		stroke={color}
		strokeWidth={1.5}
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<Defs>
			<ClipPath id='a'>
				<Path d='M0 0h24v10H0z' />
			</ClipPath>
		</Defs>
		<Path
			d='M21 13v-1c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22'
			fill={color}
			fillOpacity={0.4}
			clipPath='url(#a)'
			stroke='none'
		/>
		<Path
			d='M16 2v4M8 2v4m13 7v-1c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22M3 10h18'
			fill='none'
		/>
		<Path d='M13 19.5s1.348.507 2 2.5c0 0 3.177-5 6-6' fill='none' />
	</Svg>
);
export default CalendarCheck;
