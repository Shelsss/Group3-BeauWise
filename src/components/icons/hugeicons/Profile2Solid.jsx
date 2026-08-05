import Svg, { Path } from 'react-native-svg';
const Profile2Solid = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		fill={color}
		stroke={color}
		strokeWidth={1.5}
		strokeLinejoin='round'
	>
		<Path d='M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2 7h-4a5 5 0 0 0-5 5 2 2 0 0 0 2 2h10a2 2 0 0 0 2-2 5 5 0 0 0-5-5Z' />
	</Svg>
);
export default Profile2Solid;
