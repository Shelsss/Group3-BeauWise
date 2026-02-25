import { renderRouter, screen, fireEvent } from 'expo-router/testing-library';
import { Text } from 'react-native';
import TopTabsLayout from '../src/app/(tabs)/_layout';

const HomeScreen = () => <Text>Home Content</Text>;
const HistoryScreen = () => <Text>History Content</Text>;
const LearnScreen = () => <Text>Learn Content</Text>;
const ProfileScreen = () => <Text>Profile Content</Text>;

describe('TopTabsLayout', () => {
	beforeEach(() => {
		renderRouter(
			{
				_layout: TopTabsLayout,
				index: HomeScreen,
				history: HistoryScreen,
				learn: LearnScreen,
				profile: ProfileScreen
			},
			{ initialUrl: '/' }
		);
	});

	it('renders the layout', async () => {
		expect(screen.getByTestId('home-tab')).toBeOnTheScreen();
		expect(screen.getByTestId('history-tab')).toBeOnTheScreen();
		expect(screen.getByTestId('learn-tab')).toBeOnTheScreen();
		expect(screen.getByTestId('profile-tab')).toBeOnTheScreen();
	});

	it('navigates to History tab on press and renders History content', () => {
		const historyTab = screen.getByTestId('history-tab');
		expect(historyTab).toBeTruthy();

		fireEvent.press(historyTab);

		expect(screen.getByText('History Content')).toBeTruthy();
		expect(screen).toHavePathname('/history');
	});

	it('navigates to Learn tab on press and renders Learn content', () => {
		const learnTab = screen.getByTestId('learn-tab');
		expect(learnTab).toBeTruthy();

		fireEvent.press(learnTab);

		expect(screen.getByText('Learn Content')).toBeTruthy();
		expect(screen).toHavePathname('/learn');
	});

	it('navigates to Profile tab on press and renders Profile content', () => {
		const profileTab = screen.getByTestId('profile-tab');
		expect(profileTab).toBeTruthy();

		fireEvent.press(profileTab);
		expect(screen.getByText('Profile Content')).toBeTruthy();
		expect(screen).toHavePathname('/profile');
	});
});
