import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Measure = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
	>
		<Path
			d='M2 9v6.667C2 17.507 5.134 19 9 19h11c.943 0 1.414 0 1.707-.293S22 17.943 22 17v-3c0-.943 0-1.414-.293-1.707S20.943 12 20 12H9c-3.866 0-7-1.567-7-3.5Z'
			fill={color}
			fillOpacity={0.35}
			stroke='none'
		/>
		<Path
			d='M5 9.979C5 11.095 6.79 12 9 12V9.979c0-.994 0-1.492-.397-1.795-.398-.303-.792-.19-1.58.037C5.815 8.57 5 9.226 5 9.98Z'
			strokeLinejoin='round'
		/>
		<Path d='M16 8.5c0 2.933-3.134 3.5-7 3.5s-7.25-1.567-7-3.5C2 6.567 5.134 5 9 5s7 1.567 7 3.5Z' />
		<Path d='M2 9v6.667C2 17.507 5.134 19 9 19h11c.943 0 1.414 0 1.707-.293S22 17.943 22 17v-3c0-.943 0-1.414-.293-1.707S20.943 12 20 12H9' />
		<Path
			d='M18 19v-2m-4 2v-2m-4 2v-2m-4 1.5v-2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Measure;
