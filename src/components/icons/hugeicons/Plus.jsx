import * as React from 'react';
import { createAnimatedComponent } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
const AnimatedPath = createAnimatedComponent(Path);
const Plus = ({ size = 24, color = 'black', animatedProps }) => {
	return (
		<Svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			width={size}
			height={size}
			fill='none'
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<AnimatedPath d='M12.001 5v14.002m7.001-7H5' animatedProps={animatedProps} />
		</Svg>
	);
};
export default Plus;
