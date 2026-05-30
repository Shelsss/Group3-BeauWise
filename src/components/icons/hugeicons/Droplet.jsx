import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Droplet = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
		strokeLinejoin='round'
	>
		<Path
			d='M10.5 21.002c-3.866 0-7-3.128-7-6.987 0-3.23 2.933-7.297 5.002-9.764.497-.593.746-.89 1.143-1.077.485-.23 1.225-.23 1.71 0 .397.187.646.484 1.145 1.079 2.067 2.465 5 6.532 5 9.762 0 3.859-3.134 6.987-7 6.987'
			fill={color}
			fillOpacity={0.35}
			stroke='none'
		/>
		<Path
			d='M16 18.338a7 7 0 0 1-5.5 2.664c-3.866 0-7-3.128-7-6.987 0-3.23 2.933-7.297 5.002-9.764.497-.593.746-.89 1.143-1.077.485-.23 1.225-.23 1.71 0 .397.187.646.484 1.145 1.079'
			strokeLinecap='round'
		/>
		<Path
			d='M17 15.035c1.933 0 3.5-1.65 3.5-3.684 0-.922-.43-1.972-.987-2.948-.901-1.579-1.352-2.368-2.513-2.368s-1.612.79-2.513 2.368c-.558.976-.987 2.026-.987 2.948 0 2.034 1.567 3.684 3.5 3.684Z'
			fill='#fff'
		/>
		<Path d='M10.5 17.035a3 3 0 0 1-3-3' strokeLinecap='round' />
	</Svg>
);
export default Droplet;
