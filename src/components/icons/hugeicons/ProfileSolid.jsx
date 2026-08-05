import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ProfileSolid = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24' // <-- Original grid
		width={size}
		height={size}
		fill={color}
	>
		{/* Head: Radius 6, shifted slightly up */}
		<Path d='M18 8.5a5 6 0 1 0-12 0 6 6 0 0 0 12 0' />
		{/* Body: Radius 9 */}
		<Path d='M21 21.5a9 9 0 1 0-18 0Z' />
	</Svg>
);

export default ProfileSolid;
