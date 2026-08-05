import styles from '@/config/styles';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/useThemeStore';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';
const LearnSolid = ({ size = 24, color = 'black' }) => {
	const systemTheme = useColorScheme() ?? 'light';
	const themeMode = useThemeStore((state) => state.themeMode);
	const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

	return (
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
			<Path d='M5.333 3c2.46-.003 4.836.887 6.667 2.5V21a10.07 10.07 0 0 0-6.667-2.5c-1.562 0-2.343 0-2.688-.22a1.16 1.16 0 0 1-.424-.425C2 17.51 2 16.895 2 15.663v-9.26c0-1.428 0-2.141.549-2.72.548-.579 1.11-.609 2.234-.668Q5.056 3 5.333 3' />
			<Path
				fill='currentColor'
				d='M18.667 3A10.07 10.07 0 0 0 12 5.5V21a10.07 10.07 0 0 1 6.667-2.5c1.562 0 2.343 0 2.688-.22.207-.133.291-.218.424-.425.221-.345.221-.96.221-2.192v-9.26c0-1.428 0-2.141-.549-2.72s-1.11-.609-2.234-.668Q18.944 3 18.667 3'
			/>
			<Path
				stroke={styles.theme.colors[activeTheme].card_border}
				d='M19 7.326a10.4 10.4 0 0 0-2 .13m2 3.55q-.166-.005-.333-.005a10.1 10.1 0 0 0-3.667.681m4 2.819q-.166-.005-.333-.005a10.1 10.1 0 0 0-3.667.68'
			/>
			<Path d='M5 7.326a10.4 10.4 0 0 1 2 .13m-2 3.55q.166-.005.333-.005A10.1 10.1 0 0 1 9 11.682m-4 2.819q.166-.005.333-.005a10.1 10.1 0 0 1 3.667.68' />
		</Svg>
	);
};
export default LearnSolid;
