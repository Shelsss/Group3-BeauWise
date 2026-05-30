import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Magnify = ({ size = 24 }) => (
	<Svg
		width={size}
		height={size}
		viewBox='13.76 13.76 256 256'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='m160 160 38.4 38.4'
			stroke='#334155'
			strokeWidth={7.68}
			strokeLinecap='round'
		/>
		<Path
			d='m160 160 38.4 38.4'
			stroke='#8b78ff'
			strokeWidth={2.56}
			strokeLinecap='round'
		/>
		<Path
			d='M83.2 128c0 24.726 20.074 44.8 44.8 44.8s44.8-20.074 44.8-44.8-20.074-44.8-44.8-44.8-44.8 20.074-44.8 44.8'
			stroke='#334155'
			strokeWidth={3.84}
		/>

		<Path
			d='M87.04 128c0 22.606 18.354 40.96 40.96 40.96s40.96-18.354 40.96-40.96S150.606 87.04 128 87.04 87.04 105.394 87.04 128'
			fill='#8b78ff'
			fillOpacity={0.1}
		/>
	</Svg>
);
export default Magnify;
