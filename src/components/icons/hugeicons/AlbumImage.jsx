import Svg, { Path, Circle } from 'react-native-svg';
const AlbumImage = ({ size = 24, color = 'black' }) => (
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
		<Path d='M14 3h-4C6.229 3 4.343 3 3.172 4.172S2 7.229 2 11v2c0 3.771 0 5.657 1.172 6.828S6.229 21 10 21h4c3.771 0 5.657 0 6.828-1.172S22 16.771 22 13v-2c0-3.771 0-5.657-1.172-6.828S17.771 3 14 3' />
		<Circle fill='currentColor' fillOpacity={0.4} cx={8.5} cy={8.5} r={1.5} />
		<Path
			fill='currentColor'
			fillOpacity={0.4}
			d='m21.5 17-5.152-5.62a1.17 1.17 0 0 0-1.69-.037L10 16l-2.16-2.16a1.16 1.16 0 0 0-1.686.049L2.5 18v1.5c0 .8.7 1.5 1.5 1.5h16c.8 0 1.5-.7 1.5-1.5Z'
			stroke='none'
		/>
		<Path d='m21.5 17-5.152-5.62a1.17 1.17 0 0 0-1.69-.037L10 16l-2.16-2.16a1.16 1.16 0 0 0-1.686.049L2.5 18' />
	</Svg>
);
export default AlbumImage;
