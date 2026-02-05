import { render, screen, fireEvent } from '@testing-library/react-native';
import ScannerScreen from '../src/app/scanner';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
	useRouter: () => ({
		back: mockBack
	})
}));

jest.mock('lucide-react-native', () => ({
	X: 'X'
}));

jest.mock('react-native-safe-area-context', () => ({
	useSafeAreaInsets: () => ({
		top: 44
	})
}));

describe('ScannerScreen', () => {
	it('renders the title', () => {
		render(<ScannerScreen />);

		const title = screen.getByText('Scan Route');
		expect(title).toBeTruthy();
	});

	it('renders the close button', () => {
		render(<ScannerScreen />);

		const backButton = screen.getByTestId('back-button');

		expect(backButton).toBeTruthy();
	});

	it('navigates back when close button is pressed', () => {
		render(<ScannerScreen />);

		const backButton = screen.getByTestId('back-button');

		fireEvent.press(backButton);

		expect(mockBack).toHaveBeenCalled();
	});
});
