import { render, screen } from '@testing-library/react-native';
import ProfileScreen from '../src/app/(tabs)/profile';

describe('ProfileScreen', () => {
	it('renders profile screen', () => {
		render(<ProfileScreen />);

		expect(screen.getByText('Profile Tab')).toBeTruthy();
	});
});
