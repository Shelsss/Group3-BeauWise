import * as React from 'react';
import Svg, { Defs, Mask, Rect, Path } from 'react-native-svg';
const Info = ({ size = 24, color = 'black' }) => (
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
		strokeLinejoin='round'
	>
		<Defs>
			<Mask id='a'>
				<Rect width='100%' height='100%' fill='#fff' stroke='none' />
				<Path d='M12 16v-4' stroke='#000' />
				<Path
					d='M12.125 8.25H12m.25 0a.25.25 0 1 0-.5 0 .25.25 0 0 0 .5 0'
					stroke='#000'
					fill='#000'
				/>
			</Mask>
		</Defs>
		<Path
			mask='url(#a)'
			fill='currentColor'
			d='m14.394 3-.246-.209a3.31 3.31 0 0 0-4.296 0l-.246.21a4 4 0 0 1-2.276.943l-.323.025A3.31 3.31 0 0 0 3.97 7.007l-.025.323A4 4 0 0 1 3 9.606l-.21.246a3.31 3.31 0 0 0 0 4.296l.21.246a4 4 0 0 1 .943 2.276l.025.323a3.31 3.31 0 0 0 3.038 3.038l.323.025A4 4 0 0 1 9.606 21l.246.21a3.31 3.31 0 0 0 4.296 0l.246-.21a4 4 0 0 1 2.276-.943l.323-.025a3.31 3.31 0 0 0 3.038-3.038l.025-.323A4 4 0 0 1 21 14.394l.21-.246a3.31 3.31 0 0 0 0-4.296L21 9.606a4 4 0 0 1-.943-2.276l-.025-.323a3.31 3.31 0 0 0-3.038-3.038l-.323-.025A4 4 0 0 1 14.394 3'
		/>
	</Svg>
);
export default Info;
