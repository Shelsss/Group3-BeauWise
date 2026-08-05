import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Keyboard = ({ size = 24, color = 'black' }) => (
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
	>
		<Path d='M14.5 7h-5c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 9.57 2 11.212 2 14.5s0 4.931.908 6.038a4 4 0 0 0 .554.554C4.57 22 6.212 22 9.5 22h5c3.288 0 4.931 0 6.038-.908q.304-.25.554-.554C22 19.43 22 17.788 22 14.5c0-3.287 0-4.931-.908-6.038a4 4 0 0 0-.554-.554C19.43 7 17.788 7 14.5 7Z' />
		<Path
			d='M12 7V5a1 1 0 0 1 1-1 1 1 0 0 0 1-1V2M7 12h1m3.5 0h1m3.5 0h1M7 17h10'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Keyboard;
