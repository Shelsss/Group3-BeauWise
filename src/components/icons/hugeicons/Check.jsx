import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Check = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M1.25 12c0 5.937 4.813 10.75 10.75 10.75S22.75 17.937 22.75 12 17.937 1.25 12 1.25 1.25 6.063 1.25 12m15.426-3.737a1 1 0 0 1 .061 1.413l-5.5 6a1 1 0 0 1-1.444.031l-2.5-2.5a1 1 0 1 1 1.414-1.414l1.762 1.761 4.794-5.23a1 1 0 0 1 1.413-.061'
			fill={color}
		/>
	</Svg>
);
export default Check;
