import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const AlertFill = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M1 21 12 2l11 19zm11.713-3.288A.97.97 0 0 0 13 17a.97.97 0 0 0-.287-.712A.97.97 0 0 0 12 16a.97.97 0 0 0-.713.288A.97.97 0 0 0 11 17q0 .424.287.712.288.288.713.288.424 0 .713-.288M11 15h2v-5h-2z'
			fill={color}
		/>
	</Svg>
);
export default AlertFill;
