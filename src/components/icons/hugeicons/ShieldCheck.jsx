import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ShieldCheck = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			opacity={0.4}
			fillRule='evenodd'
			clipRule='evenodd'
			d='M12 2c.424 0 1.024.266 2.223.798.879.39 1.979.818 3.227 1.173 1.827.52 2.742.78 3.146 1.314C21 5.82 21 6.64 21 8.28v2.904c0 5.624-5.063 9-7.594 10.336-.607.32-.91.48-1.406.48s-.8-.16-1.406-.48C8.063 20.184 3 16.808 3 11.184V8.28c0-1.64 0-2.46.404-2.995S4.723 4.49 6.55 3.971a25 25 0 0 0 3.227-1.173C10.977 2.266 11.576 2 12 2m0 4.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10'
			fill={color}
		/>
		<Path
			d='M21 11.183V8.28c0-1.64 0-2.46-.404-2.995s-1.318-.794-3.145-1.314a25 25 0 0 1-3.229-1.173C13.023 2.266 12.424 2 12 2s-1.023.266-2.222.798c-.88.39-1.98.818-3.229 1.173-1.827.52-2.74.78-3.145 1.314C3 5.82 3 6.64 3 8.28v2.903c0 5.625 5.063 9 7.594 10.336.607.32.91.481 1.406.481s.799-.16 1.406-.48C15.937 20.182 21 16.807 21 11.182Z'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
		<Path
			d='M10 12s.5 0 1 1c0 0 1.588-2.5 3-3'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M17 11.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
	</Svg>
);
export default ShieldCheck;
