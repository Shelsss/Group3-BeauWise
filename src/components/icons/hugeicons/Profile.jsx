import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Profile = ({ size = 24, color = 'black' }) => (
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
		<Path d='M17 8.5a5 5 0 1 0-10 0 5 5 0 0 0 10 0' />
		<Path d='M19 20.5a7 7 0 1 0-14 0' />
	</Svg>
);
export default Profile;
