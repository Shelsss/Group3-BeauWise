import * as React from 'react';
import Svg, { Defs, Mask, Rect, Path } from 'react-native-svg';
const HistorySolid = ({ size = 24, color = 'black' }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Defs>
			<Mask id='a' x={0} y={0} width={24} height={24}>
				<Rect width='100%' height='100%' fill='#fff' />
				<Path
					className='top-line'
					stroke='#000'
					strokeWidth={1.5}
					strokeLinecap='round'
					d='M7 7h8'
				/>
				<Path
					className='bottom-line'
					stroke='#000'
					strokeWidth={1.5}
					strokeLinecap='round'
					d='M7 11h4'
				/>
			</Mask>
		</Defs>
		<Path
			d='M3 10v4c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22c1.873 0 3.281 0 4.368-.144A4.502 4.502 0 0 1 16.5 13c.925 0 1.785.28 2.5.758V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2 5.343 2 4.172 3.172 3 6.229 3 10'
			fill={color}
			mask='url(#a)'
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
export default HistorySolid;
