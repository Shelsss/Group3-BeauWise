import * as React from 'react';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
const BookOnboarding = ({ size = 24 }) => (
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
			d='M45 90s25 15 65 5c40 10 65-5 65-5v30s-25 15-65 5c-40 10-65-5-65-5z'
			fill='#fff'
		/>
		<Path
			d='M45 90s25 15 65 5c40 10 65-5 65-5v30s-25 15-65 5c-40 10-65-5-65-5z'
			stroke='#8b78ff'
			strokeWidth={3}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path d='M110 125V95' stroke='#8b78ff' strokeWidth={2} strokeLinecap='round' />
		<Path
			d='M48 85s24 13 60 5m64-5s-24 13-60 5'
			stroke='#ffafa3'
			strokeWidth={2}
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
export default BookOnboarding;
