import * as React from 'react';
import Svg, { Defs, ClipPath, Path, Circle } from 'react-native-svg';
const TestTube2 = ({ size = 24, color = 'black' }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size}
		height={size}
		fill='none'
		stroke={color}
		strokeWidth={1.5}
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<Defs>
			<ClipPath id='a'>
				<Path d='M9.527 2v4.258c0 .662-.352 1.233-.933 1.544-2.985 1.6-5.79 6.133-2.848 10.778C6.404 19.72 8.576 22 12 22s5.596-2.28 6.254-3.419c2.941-4.645.137-9.178-2.848-10.778a1.73 1.73 0 0 1-.934-1.544V2.001' />
			</ClipPath>
		</Defs>
		<Path
			fillOpacity={0.4}
			d='M0 11.15h5.533s3-.925 5.5 1.852q2.95 2.247 6 0c.889-.409 1.5-1.388 1.5-1.388H24V24H0Z'
			fill={color}
			clipPath='url(#a)'
			stroke='none'
		/>
		<Path d='M9.527 2v4.258c0 .662-.352 1.233-.933 1.544-2.985 1.6-5.79 6.133-2.848 10.778C6.404 19.72 8.576 22 12 22s5.596-2.28 6.254-3.419c2.941-4.645.137-9.178-2.848-10.778a1.73 1.73 0 0 1-.934-1.544V2.001M8 2h8' />
		<Path d='M5.533 11.15s3-.925 5.5 1.852m7.5-1.388s-.611.979-1.5 1.389' />
		<Circle cx={14} cy={14} r={1.25} fill={color} stroke='none' />
		<Circle cx={10} cy={18} r={1} fill={color} stroke='none' />
	</Svg>
);
export default TestTube2;
