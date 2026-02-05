import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../src/app/(tabs)/index';

describe('HomeScreen', () => {
	it('renders home screen', () => {
		render(<HomeScreen />);

		expect(screen.getByText('Home Tab')).toBeTruthy();
	});
});
