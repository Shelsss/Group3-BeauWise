import { render, screen } from '@testing-library/react-native';
import LearnScreen from '../src/app/(tabs)/learn';

describe('LearnScreen', () => {
	it('renders learn screen', () => {
		render(<LearnScreen />);

		expect(screen.getByText('Learn Tab')).toBeTruthy();
	});
});
