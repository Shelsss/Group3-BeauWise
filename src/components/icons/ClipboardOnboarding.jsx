import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ClipboardOnboarding = ({ size = 24 }) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 256 256'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M89.6 204.8h76.8c7.069 0 12.8-5.731 12.8-12.8v-89.6c0-7.07-5.731-12.8-12.8-12.8H89.6c-7.07 0-12.8 5.73-12.8 12.8V192c0 7.069 5.73 12.8 12.8 12.8'
			stroke='#334155'
			strokeWidth={2.56}
		/>
		<Path
			d='M98.56 115.2h58.88a2.56 2.56 0 0 1 2.56 2.56v46.08a2.56 2.56 0 0 1-2.56 2.56H98.56a2.56 2.56 0 0 1-2.56-2.56v-46.08a2.56 2.56 0 0 1 2.56-2.56'
			fill='#ffafa3'
			fillOpacity={0.3}
		/>
		<Path
			d='M102.4 128h38.4m-38.4 12.8H128'
			stroke='#334155'
			strokeWidth={1.92}
			strokeLinecap='round'
		/>
		<Path
			d='M102.4 89.6V70.4a6.4 6.4 0 0 1 6.4-6.4h38.4a6.4 6.4 0 0 1 6.4 6.4v19.2z'
			fill='#fff'
		/>
		<Path
			d='M102.4 89.6V70.4a6.4 6.4 0 0 1 6.4-6.4h38.4a6.4 6.4 0 0 1 6.4 6.4v19.2h-51.2'
			stroke='#334155'
			strokeWidth={2.56}
		/>
	</Svg>
);
export default ClipboardOnboarding;
