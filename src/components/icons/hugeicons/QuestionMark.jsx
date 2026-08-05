import styles from '@/config/styles';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
const QuestionMark = ({ size = 24, color = 'black' }) => (
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
		<Circle cx={12} cy={12} r={10} fill={color} />
		<Path
			stroke={styles.theme.colors.primary}
			d='M9.5 9.5a2.5 2.5 0 1 1 3.912 2.064C12.728 12.032 12 12.672 12 13.5m.125 3.25H12m.25 0a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0'
		/>
	</Svg>
);
export default QuestionMark;
