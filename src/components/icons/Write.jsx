import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Write = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M0 13.333v-2.666h9.333v2.666zM0 8V5.333h14.667V8zm0-5.333V0h14.667v2.667zm12 18.666v-4.1L19.367 9.9q.3-.3.666-.433.368-.134.734-.134a2 2 0 0 1 1.433.6l1.233 1.234q.267.3.417.666.15.368.15.734t-.133.75a1.8 1.8 0 0 1-.434.683L16.1 21.333zm8.767-7.466 1.233-1.3-1.233-1.234L19.5 12.6z'
			fill={color}
		/>
	</Svg>
);
export default Write;
