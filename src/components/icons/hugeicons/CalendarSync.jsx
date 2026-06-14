import * as React from 'react';
import Svg, { Defs, ClipPath, Path } from 'react-native-svg';
const CalendarSync = ({ size = 24, color = 'black' }) => (
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
		<Defs>
			<ClipPath id='a'>
				<Path d='M12 22h-1c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14v-2c0-3.771 0-5.657 1.172-6.828S7.229 4 11 4h2c3.771 0 5.657 0 6.828 1.172C20.892 6.235 20.99 7.886 21 11' />
			</ClipPath>
		</Defs>
		<Path
			fill='currentColor'
			fillOpacity={0.4}
			clipPath='url(#a)'
			d='M0 0h24v10H0z'
			stroke='none'
		/>
		<Path d='M16 2v4M8 2v4m4 16h-1c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14v-2c0-3.771 0-5.657 1.172-6.828S7.229 4 11 4h2c3.771 0 5.657 0 6.828 1.172C20.892 6.235 20.99 7.886 21 11M3 10h18' />
		<Path d='M14.385 15.786a4 4 0 0 1 7.08-.286m-7.08.286C14.683 16 15.15 16 16 16h1m-2.615-.214a1 1 0 0 1-.092-.079C14 15.414 14 14.943 14 14v-1m7.615 6.215a4 4 0 0 1-7.08.285m7.08-.285C21.317 19 20.85 19 20 19h-1m2.615.215a1 1 0 0 1 .092.078C22 19.586 22 20.057 22 21v1' />
	</Svg>
);
export default CalendarSync;
