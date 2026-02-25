import { render, screen } from '@testing-library/react-native';
import HistoryScreen from '../src/app/(tabs)/history';

describe('HistoryScreen', () => {
	it('renders history screen', () => {
		render(<HistoryScreen />);

		expect(screen.getByText('History Tab')).toBeTruthy();
	});
});
