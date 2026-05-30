import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Transaction = ({ size = 24, color = 'black' }) => (
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
			d='M3 10v4c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22c1.873 0 3.281 0 4.368-.144A4.502 4.502 0 0 1 16.5 13c.925 0 1.785.28 2.5.758V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2 5.343 2 4.172 3.172 3 6.229 3 10'
			fill={color}
		/>
		<Path
			d='M19 10.5V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2 5.343 2 4.172 3.172 3 6.229 3 10v4.5c0 3.287 0 4.931.908 6.038q.25.304.554.554C5.57 22 7.212 22 10.5 22M7 7h8m-8 4h4'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='m18 18.5-1.5-.55V15.5m-4.5 2a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Transaction;
