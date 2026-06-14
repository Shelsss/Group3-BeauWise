import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Analysis = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		color={color}
	>
		<Path
			d='M21 21H10c-3.3 0-4.95 0-5.975-1.025S3 17.3 3 14V3'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
		<Path
			opacity={0.4}
			d='M7 4h1M7 7h4'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
		/>
		<Path
			opacity={0.4}
			d='M5 20c1.07-1.947 2.523-6.981 5.306-6.981 1.924 0 2.422 2.453 4.308 2.453C17.857 15.472 17.387 10 21 10'
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);
export default Analysis;
