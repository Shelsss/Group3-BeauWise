import * as React from 'react';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
const BulbOnboarding = ({ size = 24 }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 220 220'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M20 110c0 49.672 40.328 90 90 90s90-40.328 90-90-40.328-90-90-90-90 40.328-90 90'
			fill='url(#a)'
			fillOpacity={0.4}
		/>
		<Path
			d='M110 85.5c-13.807 0-25 11.193-25 25 0 9.4 5.2 17.6 13 22v8c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-8c7.8-4.4 13-12.6 13-22 0-13.807-11.193-25-25-25'
			fill='#fffbeb'
		/>
		<Path
			d='M110 85.5c-13.807 0-25 11.193-25 25 0 9.4 5.2 17.6 13 22v8c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-8c7.8-4.4 13-12.6 13-22 0-13.807-11.193-25-25-25'
			stroke='#8b78ff'
			strokeWidth={3}
		/>
		<Path d='M100 145.5v4h20v-4' stroke='#8b78ff' strokeWidth={3} strokeLinecap='round' />
		<Path
			d='m103 110.5 5 10 4-10 5 10'
			stroke='#ffafa3'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M110 70.5v5m35 15-4 4m-66-4 4 4'
			stroke='#ffafa3'
			strokeWidth={3}
			strokeLinecap='round'
		/>
		<Defs>
			<RadialGradient
				id='a'
				cx={0}
				cy={0}
				r={1}
				gradientUnits='userSpaceOnUse'
				gradientTransform='rotate(90 0 110)scale(90)'
			>
				<Stop stopColor='#ffafa3' stopOpacity={0.3} />
				<Stop offset={1} stopColor='#8b78ff' stopOpacity={0} />
			</RadialGradient>
		</Defs>
	</Svg>
);
export default BulbOnboarding;
