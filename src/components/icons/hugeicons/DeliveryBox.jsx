import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const DeliveryBox = ({ size = 24, color = 'black' }) => (
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
		<Path
			fill='currentColor'
			fillOpacity={0.2}
			d='M2.5 7.5v6c0 3.771 0 5.657 1.172 6.828S6.729 21.5 10.5 21.5h3c3.771 0 5.657 0 6.828-1.172S21.5 17.271 21.5 13.5v-6'
		/>
		<Path d='M3.87 5.315 2.5 7.5h19l-1.252-2.087c-.854-1.423-1.28-2.134-1.969-2.524-.687-.389-1.517-.389-3.176-.389h-6.15c-1.623 0-2.435 0-3.113.375-.678.376-1.109 1.064-1.97 2.44M12 7.5v-5M6 18h5m-5-3h3' />
	</Svg>
);
export default DeliveryBox;
