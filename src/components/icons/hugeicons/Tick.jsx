import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Tick = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		color={color}
		fill='none'
	>
		<Path
			fill='currentColor'
			d='M8.502 18.25h-.01a.75.75 0 0 1-.641-.378c-1.678-2.936-2.836-3.101-2.849-3.102 0 0-.258.06-.523-.219-.266-.28-.227-.598-.227-.598s.016-.289.227-.496.523-.207.523-.207c.29 0 1.701.15 3.509 2.839 1.637-2.494 6.064-8.746 10.23-10.292a.75.75 0 0 1 .522 1.406C14.625 8.924 9.198 17.799 9.143 17.889a.75.75 0 0 1-.641.361'
		/>
	</Svg>
);
export default Tick;
